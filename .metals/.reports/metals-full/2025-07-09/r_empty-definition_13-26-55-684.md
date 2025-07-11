error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/OutliersCleaner.scala:scala/collection/immutable/List#isEmpty().
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/OutliersCleaner.scala
empty definition using pc, found symbol in pc: scala/collection/immutable/List#isEmpty().
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/lines/isEmpty.
	 -java/io/lines/isEmpty#
	 -java/io/lines/isEmpty().
	 -lines/isEmpty.
	 -lines/isEmpty#
	 -lines/isEmpty().
	 -scala/Predef.lines.isEmpty.
	 -scala/Predef.lines.isEmpty#
	 -scala/Predef.lines.isEmpty().
offset: 226
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/OutliersCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source
import scala.util.Try

object OutliersCleaner {

def clean(inputFile: File): File = {


val lines = Source.fromFile(inputFile).getLines().toList
if (lines.isE@@mpty) throw new IllegalArgumentException("Empty file")

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
  val medianFormatted = if (isInt) median.round.toString else median.toString
  i -> (lower, upper, medianFormatted)
}

val cleaned = data.map { row =>
  val updated = row.clone()
  stats.foreach { case (i, (low, high, median)) =>
    val v = row(i).toDouble
    if (v < low || v > high) updated(i) = median
  }
  updated
}

val output = new File(System.getProperty("java.io.tmpdir"), s"cleaned_${inputFile.getName}")
val writer = new PrintWriter(output)
writer.println(header)
cleaned.foreach(r => writer.println(r.mkString(",")))
writer.close()

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
```


#### Short summary: 

empty definition using pc, found symbol in pc: scala/collection/immutable/List#isEmpty().