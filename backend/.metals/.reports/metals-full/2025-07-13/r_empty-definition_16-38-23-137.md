error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala:java/lang/String#
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
empty definition using pc, found symbol in pc: java/lang/String#
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/String.
	 -String.
	 -scala/Predef.String.
offset: 2257
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source
import scala.collection.mutable
import java.util.Locale

object MissingDataCleaner {

def clean(inputFile: File, placeholder: String = "Inconnu", log: Option[StringBuilder] = None): File = {

val lines = Source.fromFile(inputFile).getLines()
require(lines.hasNext, "Fichier vide ou invalide")

val header = lines.next().split(",").map(_.trim)
val nbCols = header.length

val tempRows = mutable.ArrayBuffer[List[String]]()
val colValues = Array.fill(nbCols)(mutable.ArrayBuffer[String]())

// Stockage des valeurs
for (line <- lines) {
  val row = line.split(",").map(_.trim).toList
  if (row.length == nbCols) {
    tempRows += row
    for (i <- row.indices) {
      if (!isMissing(row(i))) colValues(i) += row(i)
    }
  }
}

// Détection des types
val colType = colValues.map { col =>
  if (col.nonEmpty && col.forall(isInteger)) "int"
  else if (col.nonEmpty && col.forall(isNumeric)) "double"
  else "string"
}

val means = colValues.zip(colType).map {
  case (vals, "int")    => if (vals.nonEmpty) vals.map(_.toInt).sum.toDouble / vals.size else 0.0
  case (vals, "double") => if (vals.nonEmpty) vals.map(_.toDouble).sum / vals.size else 0.0
  case _                => 0.0
}

val modes = colValues.map { vals =>
  if (vals.nonEmpty) vals.groupBy(identity).maxBy(_._2.size)._1 else placeholder
}

val outputFile = new File(System.getProperty("java.io.tmpdir"), s"missing_cleaned_${inputFile.getName}")
val writer = new PrintWriter(outputFile)

writer.println(header.mkString(","))

var nbReplacements = 0
var nbLignesSupprimees = 0

for ((row, rowIdx) <- tempRows.zipWithIndex) {
  val ligneInvalide = row.zipWithIndex.exists { case (v, idx) =>
    isMissing(v) && colType(idx) == "string"
  }

  if (ligneInvalide) {
    nbLignesSupprimees += 1
    log.foreach(_.append(s"[SUPPRIMÉ] Ligne ${rowIdx + 2} supprimée (valeur manquante non numérique) : ${row.mkString(", ")}\n"))
  } else {
    val cleanedRow = row.zipWithIndex.map { case (v, idx) =>
      if (isMissing(v)) {
        nbReplacements += 1
        val replaced = colType(idx) match {
          case "int"    => means(idx).round.toString
          case "double" => S@@tring.format(Locale.US, "%.2f", means(idx))
          case "string" => modes(idx)
        }
        log.foreach(_.append(s"[REMPLACEMENT] Ligne ${rowIdx + 2}, colonne '${header(idx)}': valeur manquante remplacée par '$replaced'\n"))
        replaced
      } else v
    }
    writer.println(cleanedRow.mkString(","))
  }
}

writer.close()

log.foreach(_.append(s"[RÉSUMÉ] Colonnes détectées : ${header.zip(colType).map { case (h, t) => s"$h[$t]" }.mkString(", ")}\n"))
log.foreach(_.append(s"[RÉSUMÉ] Nettoyage terminé. $nbReplacements valeurs remplacées. $nbLignesSupprimees lignes supprimées.\n"))

outputFile
}

private def isMissing(value: String): Boolean =
value == null || value.trim.isEmpty || value.equalsIgnoreCase("NA") || value.equalsIgnoreCase("null") || value.equalsIgnoreCase("NaN")

private def isNumeric(value: String): Boolean =
try { value.toDouble; true } catch { case _: NumberFormatException => false }

private def isInteger(value: String): Boolean =
try { value.toInt; true } catch { case _: NumberFormatException => false }
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: java/lang/String#