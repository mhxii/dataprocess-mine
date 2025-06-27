error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala:scala/collection/immutable/List#isEmpty().
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
empty definition using pc, found symbol in pc: scala/collection/immutable/List#isEmpty().
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/rawData/isEmpty.
	 -java/io/rawData/isEmpty#
	 -java/io/rawData/isEmpty().
	 -rawData/isEmpty.
	 -rawData/isEmpty#
	 -rawData/isEmpty().
	 -scala/Predef.rawData.isEmpty.
	 -scala/Predef.rawData.isEmpty#
	 -scala/Predef.rawData.isEmpty().
offset: 470
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source

object MissingDataCleaner {

def clean(inputFile: File, placeholder: String = "Inconnu"): File = {
val lines = Source.fromFile(inputFile).getLines().toList
require(lines.nonEmpty, "Fichier vide ou invalide")

val header = lines.head.split(",").map(_.trim)
val nbCols = header.length

val rawData = lines.tail
  .map(_.split(",").map(_.trim).toList)
  .filter(_.length == nbCols)

if (rawData.isE@@mpty) throw new IllegalArgumentException("Toutes les lignes sont mal formées ou vides")

val cols = rawData.transpose
val isNumCol = cols.map(col => col.filterNot(isMissing).forall(isNumeric))

println(s"[INFO] Colonnes numériques détectées :")
header.zip(isNumCol).foreach { case (colName, isNum) =>
  if (isNum) println(s" - $colName")
}

var nbReplacements = 0

val filledCols = cols.zipWithIndex.map { case (col, idx) =>
  val known = col.filterNot(isMissing)

  if (isNumCol(idx)) {
    val mean = if (known.nonEmpty) known.map(_.toDouble).sum / known.length else 0.0
    col.map { v =>
      if (isMissing(v)) {
        nbReplacements += 1
        f"$mean%.2f"
      } else v
    }
  } else {
    val mode = if (known.nonEmpty) known.groupBy(identity).maxBy(_._2.size)._1 else placeholder
    col.map { v =>
      if (isMissing(v)) {
        nbReplacements += 1
        mode
      } else v
    }
  }
}

val finalData = filledCols.transpose.filterNot { row =>
  row.zipWithIndex.exists { case (v, idx) =>
    isMissing(v) && !isNumCol(idx)
  }
}

val nbLignesSupprimees = rawData.length - finalData.length

val outputFile = new File(System.getProperty("java.io.tmpdir"), s"missing_cleaned_${inputFile.getName}")
val writer = new PrintWriter(outputFile)
try {
  writer.println(header.mkString(","))
  finalData.foreach(r => writer.println(r.mkString(",")))
} finally {
  writer.close()
}

println(s"[MissingDataCleaner] Nettoyage terminé.")
println(s" → $nbReplacements valeurs remplacées.")
println(s" → $nbLignesSupprimees lignes supprimées (valeurs textuelles manquantes).")

outputFile
}

private def isMissing(value: String): Boolean = {
value.isEmpty || value.equalsIgnoreCase("NA") || value.equalsIgnoreCase("null") || value.trim.isEmpty
}

private def isNumeric(value: String): Boolean = {
value.matches("""-?\d+(.\d+)?""")
}
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: scala/collection/immutable/List#isEmpty().