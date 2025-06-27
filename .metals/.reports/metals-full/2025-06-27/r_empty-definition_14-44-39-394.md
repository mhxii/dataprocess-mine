error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/OutliersCleaner.scala:scala/Array.
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/OutliersCleaner.scala
empty definition using pc, found symbol in pc: scala/Array.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/Array.
	 -Array.
	 -scala/Predef.Array.
offset: 437
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/OutliersCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source

object OutliersCleaner {

def clean(inputFile: File): File = {


val lines = Source.fromFile(inputFile).getLines().toList
val header = lines.head
val data = lines.tail.map(_.split(",").map(_.trim))

// Identifier les colonnes numériques
val numericColIndexes = data.headOption
  .map(_.zipWithIndex.collect { case (v, idx) if isNumeric(v) => idx })
  .getOrElse(A@@rray.empty)

// Calcul des stats pour chaque colonne numérique
val colStats = numericColIndexes.map { idx =>
  val values = data.flatMap(row => parseDouble(row(idx))).sorted
  val mean = values.sum / values.size
  val stdDev = math.sqrt(values.map(v => math.pow(v - mean, 2)).sum / values.size)
  val median = computeMedian(values)
  (idx, mean, stdDev, median)
}.toMap

// Remplacer les outliers par la médiane
val cleanedData = data.map { row =>
  row.zipWithIndex.map { case (v, idx) =>
    if (numericColIndexes.contains(idx) && isOutlier(v, colStats(idx))) colStats(idx)._3.toString
    else v
  }
}

// Génération du fichier nettoyé
val tempDir = System.getProperty("java.io.tmpdir")
val outputFile = new File(tempDir, s"cleaned_${inputFile.getName}")
val writer = new PrintWriter(outputFile)
writer.println(header)
cleanedData.foreach(r => writer.println(r.mkString(",")))
writer.close()

outputFile
}

private def isNumeric(value: String): Boolean =
value.matches("""-?\d+(.\d+)?""")

private def parseDouble(value: String): Option[Double] =
if (isNumeric(value)) Some(value.toDouble) else None

private def isOutlier(value: String, stats: (Double, Double, Double)): Boolean = {
parseDouble(value) match {
case Some(v) =>
val (mean, stdDev, _) = stats
math.abs(v - mean) > 3 * stdDev
case None => false
}
}

private def computeMedian(sortedValues: Seq[Double]): Double = {
val n = sortedValues.size
if (n == 0) 0.0
else if (n % 2 == 1) sortedValues(n / 2)
else (sortedValues(n / 2 - 1) + sortedValues(n / 2)) / 2.0
}
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: scala/Array.