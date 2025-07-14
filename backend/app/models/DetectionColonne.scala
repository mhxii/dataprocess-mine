package models

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
import scala.util.{Try, Success, Failure}
import scala.collection.mutable

/**
 * Détecteur robuste des types de colonnes pour les fichiers CSV
 * Utilisable par tous les cleaners pour une analyse cohérente
 */
object DetectionColonne {

  // Types de données supportés
  sealed trait DataType {
    def name: String
    def priority: Int // Plus le nombre est élevé, plus le type est spécifique
  }

  case object IntegerType extends DataType {
    val name = "integer"
    val priority = 4
  }

  case object DoubleType extends DataType {
    val name = "double"
    val priority = 3
  }

  case object BooleanType extends DataType {
    val name = "boolean"
    val priority = 5
  }

  case object DateType extends DataType {
    val name = "date"
    val priority = 6
  }

  case object StringType extends DataType {
    val name = "string"
    val priority = 1
  }

  case object CategoricalType extends DataType {
    val name = "categorical"
    val priority = 2
  }

  // Statistiques d'une colonne
  case class ColumnStats(
    index: Int,
    name: String,
    dataType: DataType,
    totalValues: Int,
    nonMissingValues: Int,
    missingValues: Int,
    uniqueValues: Int,
    sampleValues: List[String],
    numericStats: Option[NumericStats] = None,
    categoricalStats: Option[CategoricalStats] = None,
    dateStats: Option[DateStats] = None
  ) {
    def missingRate: Double = if (totalValues > 0) missingValues.toDouble / totalValues else 0.0
    def uniqueRate: Double = if (nonMissingValues > 0) uniqueValues.toDouble / nonMissingValues else 0.0
  }

  case class NumericStats(
    min: Double,
    max: Double,
    mean: Double,
    median: Double,
    standardDeviation: Double
  )

  case class CategoricalStats(
    mostFrequent: String,
    mostFrequentCount: Int,
    distribution: Map[String, Int]
  )

  case class DateStats(
    minDate: LocalDate,
    maxDate: LocalDate,
    format: String
  )

  def analyzeFile(
    lines: Iterator[String],
    separator: String = ",",
    log: Option[StringBuilder] = None
  ): (Array[String], Array[ColumnStats]) = {
    if (!lines.hasNext) throw new IllegalArgumentException("Fichier vide")

    val header = lines.next().split(separator).map(_.trim)
    val nbCols = header.length
    log.foreach(_.append(s"[DETECTION] Analyse de ${nbCols} colonnes\n"))

    val columnData = Array.fill(nbCols)(mutable.ArrayBuffer[String]())
    var totalRows = 0

    for (line <- lines) {
      val row = line.split(separator, -1).map(_.trim)
      if (row.length == nbCols) {
        totalRows += 1
        for (i <- row.indices) {
          columnData(i) += row(i)
        }
      }
    }

    val columnStats = columnData.zipWithIndex.map { case (values, idx) =>
      analyzeColumn(idx, header(idx), values.toList, log)
    }

    log.foreach(_.append(s"[DETECTION] Analyse terminée: ${totalRows} lignes, ${columnStats.length} colonnes\n"))
    (header, columnStats)
  }

  def analyzeColumn(
    index: Int,
    name: String,
    values: List[String],
    log: Option[StringBuilder] = None
  ): ColumnStats = {
    val (missing, nonMissing) = values.partition(isMissing)
    val uniqueValues = nonMissing.distinct
    val detectedType = detectTypeWithTolerance(nonMissing)

    val numericStats = if (isNumericType(detectedType)) Some(calculateNumericStats(nonMissing)) else None
    val categoricalStats = if (detectedType == CategoricalType || detectedType == StringType) Some(calculateCategoricalStats(nonMissing)) else None
    val dateStats = if (detectedType == DateType) Some(calculateDateStats(nonMissing)) else None

    log.foreach(_.append(s"[DETECTION] Colonne '$name': ${detectedType.name} (${nonMissing.size}/${values.size} valeurs)\n"))

    ColumnStats(
      index = index,
      name = name,
      dataType = detectedType,
      totalValues = values.size,
      nonMissingValues = nonMissing.size,
      missingValues = missing.size,
      uniqueValues = uniqueValues.size,
      sampleValues = uniqueValues.take(10),
      numericStats = numericStats,
      categoricalStats = categoricalStats,
      dateStats = dateStats
    )
  }

  private def detectTypeWithTolerance(values: List[String]): DataType = {
    if (values.isEmpty) return StringType
    val sampleSize = math.min(1000, values.size)
    val sample = scala.util.Random.shuffle(values).take(sampleSize)

    val doubleValid = sample.count(isDouble)
    val intValid = sample.count(isInteger)
    val booleanValid = sample.count(isBoolean)
    val dateValid = sample.count(isDate)

    val toleranceThreshold = sample.size * 0.9

    if (dateValid >= toleranceThreshold) DateType
    else if (booleanValid >= toleranceThreshold) BooleanType
    else if (intValid >= toleranceThreshold) IntegerType
    else if (doubleValid >= toleranceThreshold) DoubleType
    else {
      val uniqueRatio = sample.distinct.size.toDouble / sample.size
      if (uniqueRatio < 0.5 && sample.size > 10) CategoricalType else StringType
    }
  }

  private def isBoolean(value: String): Boolean = {
    val normalized = value.toLowerCase.trim
    Set("true", "false", "1", "0", "yes", "no", "oui", "non", "y", "n").contains(normalized)
  }

  private def isInteger(value: String): Boolean = {
    Try(value.toLong).map(l => l >= Int.MinValue && l <= Int.MaxValue).getOrElse(false)
  }

  private def isDouble(value: String): Boolean = {
    Try(value.replace(',', '.').toDouble).map(d => !d.isNaN && !d.isInfinite).getOrElse(false)
  }

  private def isDate(value: String): Boolean = {
    val formats = List("yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "dd-MM-yyyy", "yyyy/MM/dd", "dd.MM.yyyy")
    formats.exists(fmt => Try(LocalDate.parse(value, DateTimeFormatter.ofPattern(fmt))).isSuccess)
  }

  private def isMissing(value: String): Boolean = {
    value == null || value.trim.isEmpty ||
    Set("NA", "null", "NaN", "NULL", "-", "?", "N/A").contains(value.trim.toUpperCase)
  }

  private def isNumericType(dataType: DataType): Boolean = {
    dataType == IntegerType || dataType == DoubleType
  }

  private def calculateNumericStats(values: List[String]): NumericStats = {
    val numbers = values.filter(isDouble).map(_.replace(',', '.').toDouble)
    val sorted = numbers.sorted
    val min = sorted.head
    val max = sorted.last
    val mean = numbers.sum / numbers.size
    val median = if (sorted.size % 2 == 0) (sorted(sorted.size / 2 - 1) + sorted(sorted.size / 2)) / 2 else sorted(sorted.size / 2)
    val variance = numbers.map(x => math.pow(x - mean, 2)).sum / numbers.size
    val stdDev = math.sqrt(variance)
    NumericStats(min, max, mean, median, stdDev)
  }

  private def calculateCategoricalStats(values: List[String]): CategoricalStats = {
    val distribution = values.groupBy(identity).view.mapValues(_.size).toMap
    val mostFrequent = distribution.maxBy(_._2)
    CategoricalStats(mostFrequent._1, mostFrequent._2, distribution)
  }

  private def calculateDateStats(values: List[String]): DateStats = {
    val formats = List("yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "dd-MM-yyyy", "yyyy/MM/dd", "dd.MM.yyyy")
    var detectedFormat = "yyyy-MM-dd"
    val dates = values.flatMap { value =>
      formats.find(fmt => Try(LocalDate.parse(value, DateTimeFormatter.ofPattern(fmt))).isSuccess) match {
        case Some(fmt) =>
          detectedFormat = fmt
          Try(LocalDate.parse(value, DateTimeFormatter.ofPattern(fmt))).toOption
        case None => None
      }
    }
    DateStats(dates.min, dates.max, detectedFormat)
  }

  def convertValue(value: String, targetType: DataType): Option[Any] = {
    if (isMissing(value)) return None
    Try {
      targetType match {
        case IntegerType => value.toInt
        case DoubleType => value.replace(',', '.').toDouble
        case BooleanType => Set("true", "1", "yes", "oui", "y").contains(value.toLowerCase.trim)
        case DateType =>
          val formats = List("yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "dd-MM-yyyy")
          formats.collectFirst {
            case fmt if Try(LocalDate.parse(value, DateTimeFormatter.ofPattern(fmt))).isSuccess =>
              LocalDate.parse(value, DateTimeFormatter.ofPattern(fmt))
          }.get
        case _ => value
      }
    }.toOption
  }

  def getDefaultValue(dataType: DataType): String = {
    dataType match {
      case IntegerType => "0"
      case DoubleType => "0.0"
      case BooleanType => "false"
      case DateType => LocalDate.now().toString
      case CategoricalType => "Unknown"
      case StringType => "Unknown"
    }
  }

  def formatValue(value: Any, dataType: DataType): String = {
    value match {
      case d: Double if dataType == DoubleType => String.format(Locale.US, "%.2f", d.asInstanceOf[java.lang.Double])
      case i: Int => i.toString
      case b: Boolean => b.toString
      case d: LocalDate => d.toString
      case s => s.toString
    }
  }
}
