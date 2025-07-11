package models

import java.io._
import scala.io.Source
import scala.collection.mutable

object Normalizer {

def clean(inputFile: File, log: Option[StringBuilder] = None): File = {


val lines = Source.fromFile(inputFile).getLines().toList
val header = lines.head
val data = lines.tail.map(_.split(",").map(_.trim))

var nbNormalized = 0

val cleanedData = data.map { row =>
  row.map { field =>
    if (isNumeric(field)) {
      field
    } else {
      val normalized = normalizeField(field)
      if (field != normalized) {
        nbNormalized += 1
        log.foreach(_.append(s"[NORMALIZED] \"$field\" → \"$normalized\"\n"))
      }
      normalized
    }
  }
}

val outputFile = new File(System.getProperty("java.io.tmpdir"), s"normalized_${inputFile.getName}")
val writer = new PrintWriter(outputFile)
writer.println(header)
cleanedData.foreach(r => writer.println(r.mkString(",")))
writer.close()

log.foreach(_.append(s"[Normalizer] $nbNormalized champs string normalisés.\n"))
outputFile
}

private def normalizeField(field: String): String = {
val normalized = java.text.Normalizer.normalize(field, java.text.Normalizer.Form.NFD)
val noAccents = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
noAccents.toLowerCase.trim.replaceAll("\\s+", " ")
}

private def isNumeric(value: String): Boolean =
value.matches("""-?\d+(.\d+)?""")
}