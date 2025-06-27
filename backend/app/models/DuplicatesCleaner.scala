package models

import java.io._
import scala.io.Source

object DuplicatesCleaner {

def clean(inputFile: File): File = {


val lines = Source.fromFile(inputFile).getLines().toList  
val header = lines.head  
val data = lines.tail.map(_.split(",").map(_.trim))  

// Détecter les colonnes STRING selon la première ligne de données  
val firstRow = data.headOption.getOrElse(Array.empty)  
val stringColIndexes = firstRow.zipWithIndex.collect {  
  case (value, idx) if !isNumeric(value) => idx  
}  

var seen = Set[String]()  

// Supprimer les doublons basés uniquement sur les colonnes STRING  
val cleanedData = data.filter { row =>  
  val key = stringColIndexes.map(row).mkString("_")  
  if (seen.contains(key)) {  
    false  
  } else {  
    seen += key  
    true  
  }  
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

private def isNumeric(value: String): Boolean =
value.matches("""-?\d+(.\d+)?""")
}