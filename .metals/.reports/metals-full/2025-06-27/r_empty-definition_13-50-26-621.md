error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/Normalizer.scala:`<none>`.
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/Normalizer.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -java/io/split.
	 -java/io/split#
	 -java/io/split().
	 -split.
	 -split#
	 -split().
	 -scala/Predef.split.
	 -scala/Predef.split#
	 -scala/Predef.split().
offset: 285
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/Normalizer.scala
text:
```scala
package models

import java.io._
import scala.io.Source
import java.text.Normalizer => JNormalizer

object Normalizer {

def clean(inputFile: File): File = {

val lines = Source.fromFile(inputFile).getLines().toList  
val header = lines.head  
val data = lines.tail.map(_.s@@plit(",").map(_.trim))  

val cleanedData = data.map { row =>  
  row.map(normalizeValue)  
}  

val tempDir = System.getProperty("java.io.tmpdir")  
val outputFile = new File(tempDir, s"cleaned_${inputFile.getName}")  
val writer = new PrintWriter(outputFile)  
writer.println(header)  
cleanedData.foreach(r => writer.println(r.mkString(",")))  
writer.close()  

outputFile  
}

private def normalizeValue(value: String): String = {
if (isNumeric(value)) value
else {
val noAccents = JNormalizer.normalize(value, JNormalizer.Form.NFD)
.replaceAll("\p{InCombiningDiacriticalMarks}+", "")
noAccents.toLowerCase.trim.replaceAll("\s+", " ")
}
}

private def isNumeric(value: String): Boolean =
value.matches("""-?\d+(.\d+)?""")

}
```


#### Short summary: 

empty definition using pc, found symbol in pc: `<none>`.