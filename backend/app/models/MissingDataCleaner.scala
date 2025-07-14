package models

import java.io._
import scala.io.Source
import scala.collection.mutable
import java.util.Locale
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import DetectionColonne._

object MissingDataCleaner {

  def clean(inputFile: File, placeholder: String = "Inconnu", log: Option[StringBuilder] = None): File = {

    val lines = Source.fromFile(inputFile).getLines()
    require(lines.hasNext, "Fichier vide ou invalide")

    // Utilisation de DetectionColonne pour analyser le fichier
    val (header, columnStats) = DetectionColonne.analyzeFile(lines, log = log)
    val nbCols = header.length

    // Relire le fichier pour traiter les données (nécessaire car l'iterator est consommé)
    val linesForProcessing = Source.fromFile(inputFile).getLines()
    linesForProcessing.next() // Skip header

    val tempRows = mutable.ArrayBuffer[List[String]]()
    val colValues = Array.fill(nbCols)(mutable.ArrayBuffer[String]())

    // Stocker les valeurs non manquantes valides
    for (line <- linesForProcessing) {
      val row = line.split(",").map(_.trim).toList
      if (row.length == nbCols) {
        tempRows += row
        for (i <- row.indices) {
          if (!isMissing(row(i)) && isValidForColumnType(row(i), getColumnType(columnStats(i)))) {
            colValues(i) += row(i)
          }
        }
      }
    }

    // Utiliser les types détectés par DetectionColonne
    val colType = columnStats.map { stats =>
      stats.dataType match {
        case DetectionColonne.IntegerType => "int"
        case DetectionColonne.DoubleType => "double"
        case _ => "string"
      }
    }

    // Calcul des moyennes (pas utilisées, mais disponibles)
    val means = colValues.zip(colType).map {
      case (vals, "int")    => if (vals.nonEmpty) vals.map(_.toInt).sum.toDouble / vals.size else 0.0
      case (vals, "double") => if (vals.nonEmpty) vals.map(_.toDouble).sum / vals.size else 0.0
      case _                => 0.0
    }

    val outputFile = new File(System.getProperty("java.io.tmpdir"), s"missing_cleaned_${inputFile.getName}")
    val writer = new PrintWriter(outputFile)

    writer.println(header.mkString(","))

    var nbReplacements = 0
    var nbLignesSupprimees = 0

    for ((row, rowIdx) <- tempRows.zipWithIndex) {

      // 1. Vérifier d'abord s'il y a des valeurs manquantes non numériques
      val hasNonNumericMissing = row.zipWithIndex.exists { case (v, idx) =>
        isMissing(v) && colType(idx) == "string"
      }

      if (hasNonNumericMissing) {
        // Supprimer la ligne si elle contient des valeurs manquantes non numériques
        nbLignesSupprimees += 1
        log.foreach(_.append(s"[SUPPRIMÉ] Ligne ${rowIdx + 2} supprimée (valeur manquante non numérique): ${row.mkString(", ")}\n"))
      } else {
        // 2. Traiter les valeurs manquantes numériques ET les valeurs non-numériques dans colonnes numériques
        val cleanedRow = row.zipWithIndex.map { case (v, idx) =>
          if (colType(idx) != "string") {
            // Pour les colonnes numériques, vérifier valeurs manquantes OU valeurs non-numériques
            val shouldReplace = isMissing(v) || !isValidForColumnType(v, colType(idx))
            
            if (shouldReplace) {
              nbReplacements += 1
              val replacement = colType(idx) match {
                case "int"    => "-9999"
                case "double" => "-9999.99"  // Toujours avec un point
                case _        => v // Ne devrait pas arriver
              }
              val reason = if (isMissing(v)) "valeur manquante" else "valeur non-numérique"
              log.foreach(_.append(s"[REMPLACEMENT] Ligne ${rowIdx + 2}, colonne '${header(idx)}': $reason '$v' remplacée par '$replacement'\n"))
              replacement
            } else {
              // Normaliser le format des nombres (remplacer virgule par point si nécessaire)
              normalizeNumber(v, colType(idx))
            }
          } else v
        }
        writer.println(cleanedRow.mkString(","))
      }
    }

    writer.close()

    // Utiliser les informations de DetectionColonne pour le logging
    val columnInfo = header.zip(columnStats).map { case (h, stats) => 
      s"$h[${stats.dataType.name}]" 
    }.mkString(", ")

    log.foreach(_.append(s"[RÉSUMÉ] Colonnes détectées : $columnInfo\n"))
    log.foreach(_.append(s"[RÉSUMÉ] Nettoyage terminé. $nbReplacements valeurs problématiques remplacées par -9999 (valeurs manquantes + valeurs non-numériques dans colonnes numériques). $nbLignesSupprimees lignes supprimées (valeurs non-numériques manquantes).\n"))

    outputFile
  }

  private def isMissing(value: String): Boolean =
    value == null || value.trim.isEmpty || value.equalsIgnoreCase("NA") || value.equalsIgnoreCase("null") || value.equalsIgnoreCase("NaN")

  private def isNumeric(value: String): Boolean = {
    if (value == null || value.trim.isEmpty) return false
    try { 
      // Normaliser d'abord (remplacer virgule par point)
      val normalized = value.replace(",", ".")
      normalized.toDouble
      true 
    } catch { 
      case _: NumberFormatException => false 
    }
  }

  private def isInteger(value: String): Boolean = {
    if (value == null || value.trim.isEmpty) return false
    try { 
      // Pour les entiers, pas de virgule attendue
      value.toInt
      true 
    } catch { 
      case _: NumberFormatException => false 
    }
  }

  // Vérifie si une valeur est valide pour un type de colonne donné
  private def isValidForColumnType(value: String, columnType: String): Boolean = {
    if (value == null || value.trim.isEmpty) return false
    
    columnType match {
      case "int" => isInteger(value)
      case "double" => isNumeric(value) // Un double peut accepter les entiers aussi
      case "string" => true // Les strings acceptent tout
      case _ => false
    }
  }

  // Normalise un nombre pour utiliser le point comme séparateur décimal
  private def normalizeNumber(value: String, columnType: String): String = {
    columnType match {
      case "double" => 
        try {
          // Convertir en remplaçant la virgule par un point, puis reconvertir en string avec point
          val normalized = value.replace(",", ".")
          val doubleValue = normalized.toDouble
          doubleValue.toString
        } catch {
          case _: NumberFormatException => value // Si échec, garder la valeur originale
        }
      case "int" => value // Les entiers n'ont pas de problème de séparateur
      case _ => value
    }
  }

  // Helper pour obtenir le type de colonne depuis les stats
  private def getColumnType(stats: DetectionColonne.ColumnStats): String = {
    stats.dataType match {
      case DetectionColonne.IntegerType => "int"
      case DetectionColonne.DoubleType => "double"
      case _ => "string"
    }
  }
}