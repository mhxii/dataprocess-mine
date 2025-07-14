error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala:scala/collection/mutable/ArrayBuffer.
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
empty definition using pc, found symbol in pc: scala/collection/mutable/ArrayBuffer.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/mutable/ArrayBuffer.
	 -java/io/mutable/ArrayBuffer#
	 -java/io/mutable/ArrayBuffer().
	 -scala/collection/mutable/ArrayBuffer.
	 -scala/collection/mutable/ArrayBuffer#
	 -scala/collection/mutable/ArrayBuffer().
	 -DetectionColonne.mutable.ArrayBuffer.
	 -DetectionColonne.mutable.ArrayBuffer#
	 -DetectionColonne.mutable.ArrayBuffer().
	 -mutable/ArrayBuffer.
	 -mutable/ArrayBuffer#
	 -mutable/ArrayBuffer().
	 -scala/Predef.mutable.ArrayBuffer.
	 -scala/Predef.mutable.ArrayBuffer#
	 -scala/Predef.mutable.ArrayBuffer().
offset: 753
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source
import scala.collection.mutable
import DetectionColonne._
import DetectionColonne.isNumericType

object MissingDataCleaner {

  def clean(inputFile: File, placeholder: String = "Inconnu", log: Option[StringBuilder] = None): File = {
    val lines = Source.fromFile(inputFile).getLines()
    require(lines.hasNext, "Fichier vide ou invalide")

    // 1. Analyse du fichier avec DetectionColonne
    val (header, columnStats) = analyzeFile(lines, log = log)
    val nbCols = header.length

    // 2. Relire le fichier pour traitement (car lines est consommé)
    val lines2 = Source.fromFile(inputFile).getLines()
    lines2.next() // skip header

    val rows = mutable.ArrayB@@uffer[List[String]]()
    for (line <- lines2) {
      val row = line.split(",").map(_.trim).toList
      if (row.length == nbCols) rows += row
    }

    val outputFile = new File(System.getProperty("java.io.tmpdir"), s"missing_cleaned_${inputFile.getName}")
    val writer = new PrintWriter(outputFile)

    writer.println(header.mkString(","))

    var nbReplacements = 0
    var nbLignesSupprimees = 0

    for ((row, rowIdx) <- rows.zipWithIndex) {
      val ligneInvalide = row.zipWithIndex.exists { case (v, i) =>
        isMissing(v) && !isNumericType(columnStats(i).dataType)
      }

      if (ligneInvalide) {
        nbLignesSupprimees += 1
        log.foreach(_.append(s"[SUPPRIMÉ] Ligne ${rowIdx + 2} supprimée (valeur manquante non numérique): ${row.mkString(", ")}\n"))
      } else {
        val cleanedRow = row.zipWithIndex.map { case (v, i) =>
          val dtype = columnStats(i).dataType
          if (isNumericType(dtype)) {
            if (isMissing(v) || !isValidForNumeric(v)) {
              nbReplacements += 1
              val replacement = dtype match {
                case IntegerType => "-9999"
                case DoubleType  => "-9999.99"
                case _           => v
              }
              val reason = if (isMissing(v)) "valeur manquante" else "valeur non-numérique"
              log.foreach(_.append(s"[REMPLACEMENT] Ligne ${rowIdx + 2}, colonne '${header(i)}': $reason '$v' remplacée par '$replacement'\n"))
              replacement
            } else v
          } else v
        }

        writer.println(cleanedRow.mkString(","))
      }
    }

    writer.close()

    val colTypes = header.zip(columnStats).map { case (h, stats) =>
      s"$h[${stats.dataType.name}]"
    }.mkString(", ")

    log.foreach(_.append(s"[RÉSUMÉ] Colonnes détectées : $colTypes\n"))
    log.foreach(_.append(s"[RÉSUMÉ] Nettoyage terminé. $nbReplacements valeurs problématiques remplacées. $nbLignesSupprimees lignes supprimées.\n"))

    outputFile
  }

  private def isMissing(value: String): Boolean =
    value == null || value.trim.isEmpty || Set("NA", "null", "NaN", "-", "?", "N/A").contains(value.trim.toLowerCase)

  private def isValidForNumeric(value: String): Boolean =
    try { value.replace(",", ".").toDouble; true } catch { case _: Throwable => false }
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: scala/collection/mutable/ArrayBuffer.