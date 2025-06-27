error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/OutliersCleaner.scala:scala/collection/IterableOps#tail().
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/OutliersCleaner.scala
empty definition using pc, found symbol in pc: scala/collection/IterableOps#tail().
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/lines/tail.
	 -lines/tail.
	 -scala/Predef.lines.tail.
offset: 750
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/OutliersCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source
import scala.util.{Try, Success, Failure}

object OutliersCleaner {

  def clean(inputFile: File): Try[File] = {
    Try {
      if (!inputFile.exists() || !inputFile.isFile) {
        throw new IllegalArgumentException(s"Input file does not exist or is not a file: ${inputFile.getAbsolutePath}")
      }

      val source = Source.fromFile(inputFile)
      val lines = try {
        source.getLines().toList
      } finally {
        source.close()
      }

      if (lines.isEmpty) {
        throw new IllegalArgumentException("Input file is empty")
      }

      val header = lines.head
      val columns = header.split(",").map(_.trim)
      val data = lines.tai@@l.map(_.split(",").map(_.trim))

      if (data.isEmpty) {
        println("[INFO] No data rows found, returning original file")
        return cleanSafe(inputFile)
      }

      // Check that all rows have the same number of columns
      val expectedColumnCount = columns.length
      val invalidRows = data.zipWithIndex.filter { case (row, _) => row.length != expectedColumnCount }
      if (invalidRows.nonEmpty) {
        println(s"[WARNING] Found ${invalidRows.length} rows with incorrect column count")
        invalidRows.take(5).foreach { case (_, idx) =>
          println(s"[WARNING] Row ${idx + 2} has ${data(idx).length} columns, expected $expectedColumnCount")
        }
      }

      // Filter out rows with incorrect column count for processing
      val validData = data.filter(_.length == expectedColumnCount)
      
      if (validData.isEmpty) {
        throw new IllegalArgumentException("No valid data rows found after filtering")
      }

      // Find numeric column indices - only columns where ALL valid rows contain numeric values
      val numericIndexes = columns.indices.filter { idx =>
        validData.forall(row => isNumeric(row(idx)))
      }

      if (numericIndexes.isEmpty) {
        println("[INFO] No numeric columns found, returning original file")
        return cleanSafe(inputFile)
      }

      // Calculate statistics for outlier detection
      val stats = numericIndexes.map { idx =>
        val values = validData.map(row => row(idx).toDouble).sorted
        
        if (values.isEmpty) {
          throw new RuntimeException(s"No valid numeric values found for column $idx")
        }
        
        val mean = values.sum / values.length
        val variance = values.map(v => math.pow(v - mean, 2)).sum / values.length
        val std = math.sqrt(variance)
        
        // Use 3-sigma rule for outlier detection
        val lower = mean - 3 * std
        val upper = mean + 3 * std
        
        // Calculate median properly
        val median = if (values.length % 2 == 0) {
          (values(values.length / 2 - 1) + values(values.length / 2)) / 2.0
        } else {
          values(values.length / 2)
        }
        
        idx -> (lower, upper, median)
      }.toMap

      println(s"[INFO] Found ${numericIndexes.length} numeric columns: ${numericIndexes.mkString(", ")}")
      stats.foreach { case (idx, (low, high, med)) =>
        println(f"[INFO] Column $idx (${columns(idx)}): bounds=[$low%.2f, $high%.2f], median=$med%.2f")
      }

      // Replace outliers with median values
      var outlierCount = 0
      val cleanedData = data.map { row =>
        if (row.length != expectedColumnCount) {
          // Keep invalid rows as-is
          row
        } else {
          val newRow = row.clone()
          stats.foreach { case (idx, (low, high, median)) =>
            Try(row(idx).toDouble) match {
              case Success(value) =>
                if (value < low || value > high) {
                  newRow(idx) = median.toString
                  outlierCount += 1
                }
              case Failure(_) =>
                // This shouldn't happen since we filtered for numeric columns
                println(s"[WARNING] Non-numeric value found in supposedly numeric column $idx: ${row(idx)}")
            }
          }
          newRow
        }
      }

      println(s"[INFO] Replaced $outlierCount outlier values with median")

      // Write cleaned data to output file
      val outputFile = new File(System.getProperty("java.io.tmpdir"), s"cleaned_${inputFile.getName}")
      val writer = new PrintWriter(new FileWriter(outputFile))
      
      try {
        writer.println(header)
        cleanedData.foreach(row => writer.println(row.mkString(",")))
      } finally {
        writer.close()
      }

      println(s"[INFO] Cleaned file saved to: ${outputFile.getAbsolutePath}")
      outputFile
    }
  }

  private def isNumeric(value: String): Boolean = {
    if (value == null || value.trim.isEmpty) false
    else {
      Try(value.trim.toDouble).isSuccess
    }
  }

  // Alternative method that returns the cleaned file directly (throws exceptions on error)
  def cleanUnsafe(inputFile: File): File = clean(inputFile)

  def clean(inputFile: File): File = {
    cleanSafe(inputFile) match {
      case Success(file) => file
      case Failure(exception) => throw exception
    }
  }
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: scala/collection/IterableOps#tail().