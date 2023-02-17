<?php
date_default_timezone_set('Australia/Brisbane');
$callback = (string)$_GET['callback'];
if (!$callback) $callback = 'callback';
$table = $_GET['table'];
$chartType = $_GET['chartType'];

//echo $table;
//echo  "<br \>";
// Get a file into an array.  
if($chartType == 'Weights')
   $lines = file('data/LPadData.Csv',FILE_IGNORE_NEW_LINES);
elseif($chartType == 'WaterUse')
   $lines = file('data/LPadDataWU.Csv',FILE_IGNORE_NEW_LINES);
elseif($chartType == 'HourlyWaterUse')
   $lines = file('data/LpadDataHourly.Csv',FILE_IGNORE_NEW_LINES);
elseif($chartType == 'MetData')
   $lines = file('data/MetData.Csv',FILE_IGNORE_NEW_LINES);

$newLine = array(9);
if($chartType == 'MetData')
   $newLine = array(7);

$format = 'd/m/Y g:i:s A';
$data = array();

$offSet = ($table - 1) * 8 + 1;

$newLine = array(9);
   
for ($i = 0; $i < count($lines); $i++) {
   $items = explode(",",$lines[$i]);  
   $date = DateTime::createFromFormat($format, $items[0]);
     
   $newLine[0] = $date->getTimestamp()* 1000; 
	if($chartType == 'MetData'){
		for($dataPoint = 0;$dataPoint < 6;$dataPoint++){
			$newLine[$dataPoint+1] = $items[$dataPoint + 1];
		}
	}
	else{
		for($pot = 0;$pot < 8;$pot++){
			$newLine[$pot+1] = $items[$pot + $offSet];
		}
	}
   
   $data[] = $newLine;
   
}

$jEncode = json_encode($data);
$jEncode = str_replace(array('\'', '"'), '', $jEncode);
//echo  "<br \>";


echo "$callback($jEncode);";

?>