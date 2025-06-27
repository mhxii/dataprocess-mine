error id: file:///C:/Users/etifo/dataprocess/app/models/MissingDataCleaner.scala:`<none>`.
file:///C:/Users/etifo/dataprocess/app/models/MissingDataCleaner.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/Source.
	 -java/io/Source#
	 -java/io/Source().
	 -scala/io/Source.
	 -scala/io/Source#
	 -scala/io/Source().
	 -Source.
	 -Source#
	 -Source().
	 -scala/Predef.Source.
	 -scala/Predef.Source#
	 -scala/Predef.Source().
offset: 56
uri: file:///C:/Users/etifo/dataprocess/app/models/MissingDataCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Sour@@ce

object MissingDataCleaner {

def clean(inputFile: File): File = {

val lines = Source.fromFile(inputFile).getLines().toList  
val header = lines.head  
val data = lines.tail.map(_.split(",").map(_.trim))  

// Nettoyage simple : supprimer lignes avec valeurs manquantes  
val cleanedData = data.filterNot(row => row.contains(""))  

val tempDir = System.getProperty("java.io.tmpdir")  
val outputFile = new File(tempDir, s"cleaned_${inputFile.getName}")  
val writer = new PrintWriter(outputFile)  

writer.println(header)  
cleanedData.foreach(r => writer.println(r.mkString(",")))  
writer.close()  

outputFile  
}
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: `<none>`.