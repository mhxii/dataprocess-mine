error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala:scala/collection/Iterator#hasNext().
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
empty definition using pc, found symbol in pc: scala/collection/Iterator#hasNext().
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/lines/hasNext.
	 -java/io/lines/hasNext#
	 -java/io/lines/hasNext().
	 -lines/hasNext.
	 -lines/hasNext#
	 -lines/hasNext().
	 -scala/Predef.lines.hasNext.
	 -scala/Predef.lines.hasNext#
	 -scala/Predef.lines.hasNext().
offset: 268
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source
import scala.collection.mutable

object MissingDataCleaner {

def clean(inputFile: File, placeholder: String = "Inconnu"): File = {


val lines = Source.fromFile(inputFile).getLines()
require(lines.ha@@sNext, "Fichier vide ou invalide")

val header = lines.next().split(",").map(_.trim)
val nbCols = header.length

// Collecte des stats
val isNumCol = Array.fill(nbCols)(true)
val sums = Array.fill(nbCols)(0.0)
val counts = Array.fill(nbCols)(0)
val freqMaps = Array.fill(nbCols)(mutable.Map[String, Int]())

val tempRows = mutable.ArrayBuffer[List[String]]()

for (line <- lines) {
  val row = line.split(",").map(_.trim).toList
  if (row.length == nbCols) {
    tempRows += row
    for (i <- row.indices) {
      val v = row(i)
      if (!isMissing(v)) {
        if (isNumeric(v)) {
          sums(i) += v.toDouble
          counts(i) += 1
        } else {
          isNumCol(i) = false
          freqMaps(i)(v) = freqMaps(i).getOrElse(v, 0) + 1
        }
      }
    }
  }
}

val means = sums.zip(counts).map { case (s, c) => if (c > 0) s / c else 0.0 }
val modes = freqMaps.map { m => if (m.nonEmpty) m.maxBy(_._2)._1 else placeholder }

val outputFile = new File(System.getProperty("java.io.tmpdir"), s"missing_cleaned_${inputFile.getName}")
val writer = new PrintWriter(outputFile)

writer.println(header.mkString(","))
var nbReplacements = 0
var nbLignesSupprimees = 0

for (row <- tempRows) {
  val cleanedRow = row.zipWithIndex.map { case (v, idx) =>
    if (isMissing(v)) {
      nbReplacements += 1
      if (isNumCol(idx)) f"${means(idx)}%.2f" else modes(idx)
    } else v
  }

  if (cleanedRow.zipWithIndex.exists { case (v, idx) => isMissing(v) && !isNumCol(idx) }) {
    nbLignesSupprimees += 1
  } else {
    writer.println(cleanedRow.mkString(","))
  }
}

writer.close()

println(s"[INFO] Colonnes numériques : ${header.zip(isNumCol).filter(_._2).map(_._1).mkString(", ")}")
println(s"[MissingDataCleaner] Nettoyage terminé. $nbReplacements valeurs remplacées. $nbLignesSupprimees lignes supprimées.")

outputFile
}

private def isMissing(value: String): Boolean =
value.isEmpty || value.equalsIgnoreCase("NA") || value.equalsIgnoreCase("null") || value.trim.isEmpty

private def isNumeric(value: String): Boolean =
value.matches("""-?\d+(.\d+)?""")
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: scala/collection/Iterator#hasNext().