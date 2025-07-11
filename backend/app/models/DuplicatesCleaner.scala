package models

import java.io._
import scala.io.Source

object DuplicatesCleaner {

def clean(inputFile: File, log: Option[StringBuilder] = None): File = {


val lines = Source.fromFile(inputFile).getLines().toList
val header = lines.head
val data = lines.tail.map(_.split(",").map(_.trim))

val firstRow = data.headOption.getOrElse(Array.empty)
val stringColIndexes = firstRow.zipWithIndex.collect {
  case (value, idx) if !isNumeric(value) => idx
}

var seen = Set[String]()
val cleanedData = data.zipWithIndex.filter { case (row, idx) =>
  val key = stringColIndexes.map(row).mkString("_")
  if (seen.contains(key)) {
    log.foreach(_.append(s"[DUPLICATE] Ligne ${idx + 2} supprimée (clé: $key)\n"))
    false
  } else {
    seen += key
    true
  }
}.map(_._1)

val outputFile = new File(System.getProperty("java.io.tmpdir"), s"duplicates_cleaned_${inputFile.getName}")
val writer = new PrintWriter(outputFile)
writer.println(header)
cleanedData.foreach(r => writer.println(r.mkString(",")))
writer.close()

val nbDoublons = data.size - cleanedData.size
log.foreach(_.append(s"[DuplicatesCleaner] $nbDoublons doublons supprimés basés sur colonnes string (${stringColIndexes.mkString(", ")})\n"))

outputFile
}

private def isNumeric(value: String): Boolean =
value.matches("""-?\d+(.\d+)?""")
}