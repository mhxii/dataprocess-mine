package models

import java.io._
import scala.io.Source
import scala.util.Try
import scala.collection.mutable.StringBuilder

object OutliersCleaner {

  def clean(inputFile: File, log: Option[StringBuilder] = None): File = {

    val lines = Source.fromFile(inputFile).getLines().toList
    if (lines.isEmpty) throw new IllegalArgumentException("Empty file")

    val header = lines.head
    val columns = header.split(",").map(_.trim)
    val data = lines.tail.map(_.split(",").map(_.trim)).filter(_.length == columns.length)

    // Détection des colonnes numériques valides (exclure -9999, NaN...)
    val numericCols = columns.indices.flatMap { i =>
      val values = data.map(_(i)).filter(v => isNumeric(v) && !isMissingLike(v))
      if (values.nonEmpty && values.forall(isNumeric)) {
        val isInt = values.forall(v => v.matches("-?\\d+"))
        Some(i -> isInt)
      } else None
    }.toMap

    if (numericCols.isEmpty) return inputFile

    // Calcul des statistiques pour les outliers
    val stats = numericCols.map { case (i, isInt) =>
      val values = data.map(_(i)).filter(v => isNumeric(v) && !isMissingLike(v)).map(_.toDouble).sorted
      val q1 = percentile(values, 25)
      val q3 = percentile(values, 75)
      val iqr = q3 - q1
      val lower = q1 - 1.5 * iqr
      val upper = q3 + 1.5 * iqr
      val median = percentile(values, 50)
      val medianFormatted = if (isInt) median.round.toString else f"$median%.2f"
      i -> (lower, upper, medianFormatted)
    }

    // Nettoyage des valeurs aberrantes
    val cleaned = data.zipWithIndex.map { case (row, rowIdx) =>
      val updated = row.clone()
      stats.foreach { case (i, (low, high, median)) =>
        val rawValue = row(i)
        if (isNumeric(rawValue)) {
          val v = rawValue.toDouble
          if (v < low || v > high) {
            log.foreach(_.append(f"[OUTLIER] Ligne ${rowIdx + 2}, colonne '${columns(i)}': valeur $v%.2f hors bornes [$low%.2f, $high%.2f], remplacée par $median\n"))
            updated(i) = median
          }
        }
      }
      updated
    }

    // Écriture du résultat
    val output = new File(System.getProperty("java.io.tmpdir"), s"outliers_cleaned_${inputFile.getName}")
    val writer = new PrintWriter(output)
    writer.println(header)
    cleaned.foreach(r => writer.println(r.mkString(",")))
    writer.close()

    log.foreach(_.append(s"[OutliersCleaner] Nettoyage terminé. Colonnes numériques traitées : ${numericCols.keys.map(columns(_)).mkString(", ")}\n"))

    output
  }

  private def isNumeric(value: String): Boolean = Try(value.toDouble).isSuccess

  private def isMissingLike(value: String): Boolean = {
    val v = value.trim.toLowerCase
    v == "na" || v == "null" || v == "nan" || v == "" || v == "-9999" || v == "-9999.99"
  }

  private def percentile(sorted: Seq[Double], percent: Double): Double = {
    val idx = (percent / 100) * (sorted.length - 1)
    val lower = sorted(idx.toInt)
    val upper = sorted.lift(idx.toInt + 1).getOrElse(lower)
    lower + (upper - lower) * (idx - idx.toInt)
  }
}
