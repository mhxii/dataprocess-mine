error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala:scala/collection/IterableOps#transpose().
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
empty definition using pc, found symbol in pc: scala/collection/IterableOps#transpose().
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/cleanedCols/transpose.
	 -java/io/cleanedCols/transpose#
	 -java/io/cleanedCols/transpose().
	 -cleanedCols/transpose.
	 -cleanedCols/transpose#
	 -cleanedCols/transpose().
	 -scala/Predef.cleanedCols.transpose.
	 -scala/Predef.cleanedCols.transpose#
	 -scala/Predef.cleanedCols.transpose().
offset: 1203
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source

object MissingDataCleaner {

  def cleanIntelligent(inputFile: File, placeholderText: String = "Inconnu"): File = {
    val lines = Source.fromFile(inputFile).getLines().toList
    require(lines.nonEmpty, "Fichier vide")

    val header = lines.head.split(",").map(_.trim)
    val data = lines.tail.map(_.split(",").map(_.trim).toList)

    val cols = data.transpose

    val cleanedCols = cols.zipWithIndex.map { case (col, idx) =>
      val known = col.filter(v => v.nonEmpty && v != "NA" && v != "null")

      if (known.forall(isNumeric)) {
        val nums = known.map(_.toDouble)
        val mean = if (nums.nonEmpty) nums.sum / nums.length else 0.0
        col.map(v => if (isMissing(v)) f"$mean%.2f" else v)

      } else if (header(idx).toLowerCase.contains("tel") || header(idx).toLowerCase.contains("phone")) {
        col.map(v => if (isMissing(v)) placeholderText else v)

      } else {
        val mode = if (known.nonEmpty) known.groupBy(identity).maxBy(_._2.size)._1 else placeholderText
        col.map(v => if (isMissing(v)) mode else v)
      }
    }

    val cleanedData = cleanedCols.transpo@@se

    val outputFile = new File(System.getProperty("java.io.tmpdir"), s"missing_intelligent_${inputFile.getName}")
    val writer = new PrintWriter(outputFile)

    try {
      writer.println(header.mkString(","))
      cleanedData.foreach(r => writer.println(r.mkString(",")))
    } finally {
      writer.close()
    }

    outputFile
  }

  private def isMissing(value: String): Boolean = {
    value.isEmpty || value.equalsIgnoreCase("NA") || value.equalsIgnoreCase("null") || value.trim.isEmpty
  }

  private def isNumeric(value: String): Boolean = value.matches("-?\\d+(\\.\\d+)?")
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: scala/collection/IterableOps#transpose().