error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala:scala/collection/LinearSeqOps#headOption().
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala
empty definition using pc, found symbol in pc: scala/collection/LinearSeqOps#headOption().
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/data/headOption.
	 -data/headOption.
	 -scala/Predef.data.headOption.
offset: 361
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source

object DuplicatesCleaner {

def clean(inputFile: File): File = {


val lines = Source.fromFile(inputFile).getLines().toList
val header = lines.head
val data = lines.tail.map(_.split(",").map(_.trim))

// Détecter les colonnes STRING selon la première ligne de données
val firstRow = data.h@@eadOption.getOrElse(Array.empty)
val stringColIndexes = firstRow.zipWithIndex.collect {
  case (value, idx) if !isNumeric(value) => idx
}

// Supprimer les doublons basés uniquement sur les colonnes STRING
val cleanedData = data
  .groupBy(row => stringColIndexes.map(row)) // clé basée sur colonnes STRING
  .map(_._2.head)                            // garder un seul exemplaire
  .toList

// Génération du fichier CSV après traitement
val tempDir = System.getProperty("java.io.tmpdir")
val outputFile = new File(tempDir, s"cleaned_${inputFile.getName}")
val writer = new PrintWriter(outputFile)
writer.println(header)
cleanedData.foreach(r => writer.println(r.mkString(",")))
writer.close()

outputFile
}

private def isNumeric(value: String): Boolean =
value.matches("""-?\d+(.\d+)?""")
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: scala/collection/LinearSeqOps#headOption().