error id: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala:`<none>`.
file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 1027
uri: file:///C:/CodeMine/dataprocess%20mine/backend/app/models/MissingDataCleaner.scala
text:
```scala
package models

import java.io._
import scala.io.Source

object MissingDataCleaner {

def clean(inputFile: File, strategy: String = "remove", placeholder: String = "NA"): File = {
val lines = Source.fromFile(inputFile).getLines().toList

require(lines.nonEmpty, "Fichier vide ou invalide")  

val header = lines.head  
val data = lines.tail.map(_.split(",").map(_.trim))  

val cleanedData = strategy match {  
  case "remove" =>  
    val before = data.length  
    val filtered = data.filterNot(row => row.exists(isMissing))  
    println(s"[MissingDataCleaner] ${before - filtered.length} lignes supprimées (valeurs manquantes)")  
    filtered  

  case "replace" =>  
    println(s"[MissingDataCleaner] Remplacement des valeurs manquantes par '$placeholder'")  
    data.map(row => row.map(v => if (isMissing(v)) placeholder else v))  

  case _ =>  
    throw new IllegalArgumentException("Stratégie inconnue : utilise 'remove' ou 'replace'")  
}  

val tempDir = System.getProperty("java.io@@.tmpdir")  
val outputFile = new File(tempDir, s"missing_cleaned_${inputFile.getName}")  
val writer = new PrintWriter(outputFile)  

try {  
  writer.println(header)  
  cleanedData.foreach(r => writer.println(r.mkString(",")))  
} finally {  
  writer.close()  
}  

outputFile  
}

private def isMissing(value: String): Boolean = {
value.isEmpty || value.equalsIgnoreCase("NA") || value.equalsIgnoreCase("null") || value.trim.isEmpty
}
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: `<none>`.