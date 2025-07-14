package models

import java.io._
import scala.io.Source
import java.text.Normalizer
import scala.collection.mutable
import DetectionColonne._

object NormalizerCleaner {

  def clean(inputFile: File, log: Option[StringBuilder] = None): File = {
    val rawLines = Source.fromFile(inputFile).getLines()
    require(rawLines.hasNext, "Fichier vide")

    val header = rawLines.next()
    val headers = header.split(",").map(_.trim)
    val data = rawLines.map(_.split(",", -1).map(_.trim).toList).toList

    if (data.isEmpty) return inputFile

    // Refaire une lecture pour analyse
    val detectionLines = Source.fromFile(inputFile).getLines()
    val (_, columnStats) = DetectionColonne.analyzeFile(detectionLines, log = log)

    // Colonnes textuelles a normaliser
    val stringIndexes = columnStats.collect {
      case stat if stat.dataType == StringType || stat.dataType == CategoricalType => stat.index
    }.toSet

    var nbNormalized = 0

    val cleaned = data.map { row =>
      row.zipWithIndex.map { case (field, idx) =>
        if (stringIndexes.contains(idx)) {
          val normalized = normalizeField(field)
          if (normalized != field) {
            nbNormalized += 1
            log.foreach(_.append(s"""[NORMALIZED] Colonne '${headers(idx)}': "$field" → "$normalized"\n"""))
          }
          normalized
        } else field
      }
    }

    val outputFile = new File(System.getProperty("java.io.tmpdir"), s"normalized_${inputFile.getName}")
    val writer = new PrintWriter(outputFile)
    writer.println(header)
    cleaned.foreach(row => writer.println(row.mkString(",")))
    writer.close()

    log.foreach(_.append(s"[Normalizer] $nbNormalized champs string normalisés (colonnes : ${stringIndexes.map(headers(_)).mkString(", ")})\n"))

    outputFile
  }

  private def normalizeField(field: String): String = {
    val withoutAccents = Normalizer.normalize(field, Normalizer.Form.NFD)
      .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
    withoutAccents.toLowerCase.trim.replaceAll("\\s+", " ")
  }
}
