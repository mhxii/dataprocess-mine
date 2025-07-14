package models

import java.io._
import scala.io.Source
import scala.collection.mutable
import DetectionColonne._

object DuplicatesCleaner {

  def clean(inputFile: File, log: Option[StringBuilder] = None): File = {
    val rawLines = Source.fromFile(inputFile).getLines()
    require(rawLines.hasNext, "Fichier vide")

    val header = rawLines.next()
    val headerCols = header.split(",").map(_.trim)
    val data = rawLines.map(_.split(",", -1).map(_.trim).toList).toList

    if (data.isEmpty) return inputFile

    // Analyser le fichier avec DetectionColonne pour avoir les types
    val detectionLines = Source.fromFile(inputFile).getLines()
    val (_, columnStats) = DetectionColonne.analyzeFile(detectionLines, log = log)

    // Filtrer les lignes strictement identiques (sur toutes les colonnes)
    val seen = mutable.Set[String]()
    val cleaned = data.zipWithIndex.filter { case (row, idx) =>
      val key = row.mkString("__§__") // Separateur peu probable pour garantir unicite
      if (seen.contains(key)) {
        log.foreach(_.append(s"[DUPLICATE] Ligne ${idx + 2} supprimee (ligne strictement identique)\n"))
        false
      } else {
        seen += key
        true
      }
    }.map(_._1)

    val output = new File(System.getProperty("java.io.tmpdir"), s"duplicates_cleaned_${inputFile.getName}")
    val writer = new PrintWriter(output)
    writer.println(header)
    cleaned.foreach(row => writer.println(row.mkString(",")))
    writer.close()

    val nbDoublons = data.size - cleaned.size
    log.foreach(_.append(s"[DuplicatesCleaner] $nbDoublons lignes strictement identiques supprimees\n"))

    output
  }
}
