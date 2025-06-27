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

// Stocker les valeurs par colonne pour analyse
val colValues = Array.fill(nbCols)(mutable.ArrayBuffer[String]())

for (line <- lines) {
  val row = line.split(",").map(_.trim).toList
  if (row.length == nbCols) {
    tempRows += row
    for (i <- row.indices) {
      if (!isMissing(row(i))) colValues(i) += row(i)
    }
  }
}

// Détecter les colonnes numériques en testant toutes les valeurs non manquantes
val isNumCol = colValues.map(col => col.nonEmpty && col.forall(isNumeric))

// Calcul des statistiques
val means = colValues.zip(isNumCol).map {
  case (vals, true) =>
    if (vals.nonEmpty) vals.map(_.toDouble).sum / vals.size else 0.0
  case _ => 0.0
}

val modes = colValues.map { vals =>
  if (vals.nonEmpty) vals.groupBy(identity).maxBy(_._2.size)._1 else placeholder
}

// Écriture du fichier nettoyé
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
value == null || value.trim.isEmpty || value.equalsIgnoreCase("NA") || value.equalsIgnoreCase("null")

private def isNumeric(value: String): Boolean =
try {
value.toDouble
true
} catch {
case _: NumberFormatException => false
}
}