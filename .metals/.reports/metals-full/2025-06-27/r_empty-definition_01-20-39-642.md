error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala:scala/collection/immutable/List#isEmpty().
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala
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
offset: 205
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source

object DuplicatesCleaner {

def clean(inputFile: File): File = {

val lines = Source.fromFile(inputFile).getLines().toList
if (lines.isEmp@@ty) throw new RuntimeException("Fichier vide")

val header = lines.head
val data = lines.tail.map(_.split(",").map(_.trim).mkString(",").toLowerCase)

val uniqueData = data.distinct

val tempDir = System.getProperty("java.io.tmpdir")
val outputFile = new File(tempDir, s"cleaned_${inputFile.getName}")
val writer = new PrintWriter(outputFile)

writer.println(header)
uniqueData.foreach(writer.println)
writer.close()

outputFile
}
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: scala/collection/immutable/List#isEmpty().