package models

import java.io._
import scala.io.Source
import scala.util.Try
import scala.collection.mutable.StringBuilder
import DetectionColonne._

object OutliersCleaner {

  def clean(inputFile: File, log: Option[StringBuilder] = None): File = {

    val lines = Source.fromFile(inputFile).getLines()
    if (!lines.hasNext) throw new IllegalArgumentException("Fichier vide")

    val (header, columnStats) = DetectionColonne.analyzeFile(lines, log = log)
    val nbCols = header.length

    // Recharger les donnees car l'iterateur a ete consomme
    val allLines = Source.fromFile(inputFile).getLines().toList
    val data = allLines.tail.map(_.split(",").map(_.trim)).filter(_.length == nbCols)

    // Identifier les colonnes numeriques detectees par DetectionColonne
    val numericCols = columnStats.filter(cs => cs.dataType == IntegerType || cs.dataType == DoubleType)

    if (numericCols.isEmpty) return inputFile

    val stats = numericCols.map { cs =>
      val idx = cs.index
      val values = data.map(_(idx)).filter(v => isNumeric(v) && !isMissingLike(v)).map(_.replace(",", ".").toDouble).sorted
      val q1 = percentile(values, 25)
      val q3 = percentile(values, 75)
      val iqr = q3 - q1
      val lower = q1 - 1.5 * iqr
      val upper = q3 + 1.5 * iqr
      val median = percentile(values, 50)
      val medianStr = cs.dataType match {
        case IntegerType => median.round.toString
        case DoubleType  => String.format(java.util.Locale.US, "%.2f", median)
        case _           => median.toString
      }
      idx -> (lower, upper, medianStr)
    }.toMap

    val cleaned = data.zipWithIndex.map { case (row, rowIdx) =>
      val updated = row.clone()
      stats.foreach { case (i, (low, high, median)) =>
        val raw = row(i)
        if (isNumeric(raw)) {
          val value = raw.replace(",", ".").toDouble
          if (value < low || value > high) {
            log.foreach(_.append(f"[OUTLIER] Ligne ${rowIdx + 2}, colonne '${header(i)}': valeur $value%.2f hors bornes [$low%.2f, $high%.2f], remplacee par $median\n"))
            updated(i) = median
          } else {
            updated(i) = raw.replace(",", ".")
          }
        }
      }
      updated
    }

    val output = new File(System.getProperty("java.io.tmpdir"), s"outliers_cleaned_${inputFile.getName}")
    val writer = new PrintWriter(output)
    writer.println(header.mkString(","))
    cleaned.foreach(r => writer.println(r.mkString(",")))
    writer.close()

    log.foreach(_.append(s"[OutliersCleaner] Nettoyage termine. Colonnes numeriques traitees : ${numericCols.map(_.name).mkString(", ")}\n"))

    output
  }

  private def isNumeric(value: String): Boolean = {
    if (value == null || value.trim.isEmpty) return false
    Try(value.replace(",", ".").toDouble).isSuccess
  }

  private def isMissingLike(value: String): Boolean = {
    val v = value.trim.toLowerCase
    Set("na", "null", "nan", "", "-9999", "-9999.99").contains(v)
  }

  private def percentile(sorted: Seq[Double], percent: Double): Double = {
    val idx = (percent / 100) * (sorted.length - 1)
    val lower = sorted(idx.toInt)
    val upper = sorted.lift(idx.toInt + 1).getOrElse(lower)
    lower + (upper - lower) * (idx - idx.toInt)
  }
}
