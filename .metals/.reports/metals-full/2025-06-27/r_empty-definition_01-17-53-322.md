error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala:`<none>`.
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/System.getProperty.
	 -java/io/System.getProperty#
	 -java/io/System.getProperty().
	 -System.getProperty.
	 -System.getProperty#
	 -System.getProperty().
	 -scala/Predef.System.getProperty.
	 -scala/Predef.System.getProperty#
	 -scala/Predef.System.getProperty().
offset: 446
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
val data = lines.tail.map(_.split(",").map(_.trim).toList)

// Suppression des doublons basés sur l'ensemble des colonnes
val uniqueData = data.distinct

// Génération du fichier CSV après traitement
val tempDir = System.getP@@roperty("java.io.tmpdir")
val outputFile = new File(tempDir, s"cleaned_${inputFile.getName}")
val writer = new PrintWriter(outputFile)

writer.println(header)
uniqueData.foreach(r => writer.println(r.mkString(",")))
writer.close()

outputFile
}
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: `<none>`.