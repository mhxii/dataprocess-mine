error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala:scala/collection/SeqOps#indices().
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
empty definition using pc, found symbol in pc: scala/collection/SeqOps#indices().
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/row/indices.
	 -java/io/row/indices#
	 -java/io/row/indices().
	 -row/indices.
	 -row/indices#
	 -row/indices().
	 -scala/Predef.row.indices.
	 -scala/Predef.row.indices#
	 -scala/Predef.row.indices().
offset: 652
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
require(lines.hasNext, "Fichier vide ou invalide")

val header = lines.next().split(",").map(_.trim)
val nbCols = header.length

val tempRows = mutable.ArrayBuffer[List[String]]()
val colValues = Array.fill(nbCols)(mutable.ArrayBuffer[String]())

for (line <- lines) {
  val row = line.split(",", -1).map(_.trim).toList
  if (row.length == nbCols) {
    tempRows += row
    for (i <- row.in@@dices) {
      if (!isMissing(row(i))) colValues(i) += row(i)
    }
  }
}

val isNumCol = colValues.map(col => col.nonEmpty && col.forall(isNumeric))
val means = colValues.zip(isNumCol).map {
  case (vals, true) if vals.nonEmpty => vals.map(_.toDouble).sum / vals.size
  case _                             => 0.0
}

val outputFile = new File(System.getProperty("java.io.tmpdir"), s"missing_cleaned_${inputFile.getName}")
val writer = new PrintWriter(outputFile)

writer.println(header.mkString(","))

var nbReplacements = 0
var nbLignesSupprimees = 0

for (row <- tempRows) {

  val hasMissingNonNum = row.zipWithIndex.exists { case (v, idx) =>
    isMissing(v) && !isNumCol(idx)
  }

  if (hasMissingNonNum) {
    nbLignesSupprimees += 1
  } else {
    val cleanedRow = row.zipWithIndex.map { case (v, idx) =>
      if (isMissing(v)) {
        nbReplacements += 1
        f"${means(idx)}%.2f"
      } else v
    }
    writer.println(cleanedRow.mkString(","))
  }
}

writer.close()

println(s"[INFO] Colonnes numériques : ${header.zip(isNumCol).filter(_._2).map(_._1).mkString(", ")}")
println(s"[INFO] Nettoyage terminé : $nbReplacements remplacements, $nbLignesSupprimees lignes supprimées")

outputFile
}

private def isMissing(value: String): Boolean =
value == null || value.trim.isEmpty || value.equalsIgnoreCase("NA") || value.equalsIgnoreCase("null") || value.equalsIgnoreCase("NaN")

private def isNumeric(value: String): Boolean =
try { value.toDouble; true } catch { case _: NumberFormatException => false }
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: scala/collection/SeqOps#indices().