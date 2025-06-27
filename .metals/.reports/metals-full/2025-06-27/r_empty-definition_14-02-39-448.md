error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala:java/lang/String#replaceAll().
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala
empty definition using pc, found symbol in pc: java/lang/String#replaceAll().
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/normalized/replaceAll.
	 -java/io/normalized/replaceAll#
	 -java/io/normalized/replaceAll().
	 -normalized/replaceAll.
	 -normalized/replaceAll#
	 -normalized/replaceAll().
	 -scala/Predef.normalized.replaceAll.
	 -scala/Predef.normalized.replaceAll#
	 -scala/Predef.normalized.replaceAll().
offset: 912
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source

object Normalizer {

def clean(inputFile: File): File = {

val lines = Source.fromFile(inputFile).getLines().toList
val header = lines.head
val data = lines.tail.map(_.split(",").map(_.trim))

// Normaliser toutes les colonnes STRING
val cleanedData = data.map { row =>
  row.map(normalizeField)
}

// Génération du fichier CSV après traitement
val tempDir = System.getProperty("java.io.tmpdir")
val outputFile = new File(tempDir, s"cleaned_${inputFile.getName}")
val writer = new PrintWriter(outputFile)
writer.println(header)
cleanedData.foreach(r => writer.println(r.mkString(",")))
writer.close()

outputFile
}

private def normalizeField(field: String): String = {
if (isNumeric(field)) field
else {
val normalized = java.text.Normalizer.normalize(field, java.text.Normalizer.Form.NFD)
val noAccents = normalized.repl@@aceAll("""\p{InCombiningDiacriticalMarks}+""", "")
noAccents.toLowerCase.trim.replaceAll("""\s+""", " ")
}
}

private def isNumeric(value: String): Boolean =
value.matches("""-?\d+(\.\d+)?""")
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: java/lang/String#replaceAll().