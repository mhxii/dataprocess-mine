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

val numericCols = columns.indices.flatMap { i =>
  val values = data.map(_(i))
  if (values.forall(isNumeric)) {
    val isInt = values.forall(v => v.matches("-?\\d+"))
    Some(i -> isInt)
  } else None
}.toMap

if (numericCols.isEmpty) return inputFile

val stats = numericCols.map { case (i, isInt) =>
  val values = data.map(r => r(i).toDouble).sorted
  val q1 = percentile(values, 25)
  val q3 = percentile(values, 75)
  val iqr = q3 - q1
  val lower = q1 - 1.5 * iqr
  val upper = q3 + 1.5 * iqr
  val median = percentile(values, 50)
  val medianFormatted = if (isInt) median.round.toString else f"$median%.2f"
  i -> (lower, upper, medianFormatted)
}

val cleaned = data.zipWithIndex.map { case (row, rowIdx) =>
  val updated = row.clone()
  stats.foreach { case (i, (low, high, median)) =>
    val v = row(i).toDouble
    if (v < low || v > high) {
      log.foreach(_.append(s"[OUTLIER] Ligne ${rowIdx + 2}, colonne '${columns(i)}' : valeur $v hors bornes [$low, $high] remplacée par $median\n"))
      updated(i) = median
    }
  }
  updated
}

val output = new File(System.getProperty("java.io.tmpdir"), s"outliers_cleaned_${inputFile.getName}")
val writer = new PrintWriter(output)
writer.println(header)
cleaned.foreach(r => writer.println(r.mkString(",")))
writer.close()

log.foreach(_.append(s"[OutliersCleaner] Nettoyage terminé. Colonnes numériques traitées : ${numericCols.keys.map(columns(_)).mkString(", ")}\n"))

output
}

private def isNumeric(value: String): Boolean = Try(value.toDouble).isSuccess

private def percentile(sorted: Seq[Double], percent: Double): Double = {
val idx = (percent / 100) * (sorted.length - 1)
val lower = sorted(idx.toInt)
val upper = sorted.lift(idx.toInt + 1).getOrElse(lower)
lower + (upper - lower) * (idx - idx.toInt)
}
}