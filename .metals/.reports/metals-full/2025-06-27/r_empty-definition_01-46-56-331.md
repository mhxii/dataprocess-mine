error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala:java/lang/System#
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala
empty definition using pc, found symbol in pc: java/lang/System#
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/System.
	 -System.
	 -scala/Predef.System.
offset: 369
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/DuplicatesCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source

object DuplicatesCleaner {

def clean(inputFile: File): File = {

val lines = Source.fromFile(inputFile).getLines().toList  
if (lines.isEmpty) throw new RuntimeException("Fichier vide")  

val header = lines.head  
val data = lines.tail  

val uniqueData = data.distinct  

val tempDir = System@@.getProperty("java.io.tmpdir")  
val outputFile = new File(tempDir, s"cleaned_${System.currentTimeMillis()}_${inputFile.getName}")  
val writer = new PrintWriter(outputFile)  

writer.println(header)  
uniqueData.foreach(writer.println)  
writer.close()  

outputFile  
}
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: java/lang/System#