-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 13, 2021 at 07:11 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `customers`
--

-- --------------------------------------------------------

--
-- Table structure for table `admininventory`
--

CREATE TABLE `admininventory` (
  `No` int(255) NOT NULL,
  `ID` int(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `brandmanagement`
--

CREATE TABLE `brandmanagement` (
  `No` int(255) NOT NULL,
  `BrandID` int(255) NOT NULL,
  `BrandName` varchar(255) NOT NULL,
  `ProductID` int(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Price` decimal(65,2) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customermanagement`
--

CREATE TABLE `customermanagement` (
  `No` int(255) NOT NULL,
  `ID` int(255) NOT NULL,
  `EmployeeID` int(255) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `ID` int(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Position` tinyint(1) NOT NULL COMMENT '0: Admin\r\nNon-0: Manager'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`ID`, `Email`, `Password`, `Position`) VALUES
(123, 'john@gmail.com', '12345', 0);

-- --------------------------------------------------------

--
-- Table structure for table `lostitems`
--

CREATE TABLE `lostitems` (
  `ID` int(255) NOT NULL,
  `Date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `InventoryID` int(255) NOT NULL,
  `ProductID` int(255) NOT NULL,
  `Quantity` int(255) NOT NULL,
  `PurchasePrice` decimal(65,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `managerinventory`
--

CREATE TABLE `managerinventory` (
  `No` int(255) NOT NULL,
  `ID` int(255) NOT NULL,
  `InventoryID` int(255) NOT NULL,
  `ProductID` int(255) NOT NULL,
  `PurchasePrice` decimal(65,2) NOT NULL,
  `SellingPrice` decimal(65,2) NOT NULL,
  `Quantity` int(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `paymentmanagement`
--

CREATE TABLE `paymentmanagement` (
  `ID` int(255) NOT NULL,
  `EmployeeID` int(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Quantity` int(255) NOT NULL,
  `Price` decimal(65,2) NOT NULL,
  `Total` decimal(65,2) NOT NULL,
  `Status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE `purchase` (
  `ID` int(255) NOT NULL,
  `InventoryID` int(255) NOT NULL,
  `ProductID` int(255) NOT NULL,
  `PurchaseID` int(255) NOT NULL,
  `PurchasePrice` decimal(65,2) NOT NULL,
  `Quantity` int(255) NOT NULL,
  `Date` date NOT NULL DEFAULT current_timestamp(),
  `Supplier` varchar(255) NOT NULL,
  `BillDiscount` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `salestracking`
--

CREATE TABLE `salestracking` (
  `ID` int(255) NOT NULL,
  `Date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `InventoryID` int(255) NOT NULL,
  `EmployeeID` int(255) NOT NULL,
  `ProductID` int(255) NOT NULL,
  `Quantity` int(255) NOT NULL,
  `Reason` varchar(255) DEFAULT NULL,
  `Status` varchar(255) NOT NULL,
  `StatusChanged` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(255) NOT NULL,
  `InventoryID` int(255) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` tinyint(1) NOT NULL,
  `Status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admininventory`
--
ALTER TABLE `admininventory`
  ADD PRIMARY KEY (`No`) USING BTREE,
  ADD UNIQUE KEY `ID` (`ID`);

--
-- Indexes for table `brandmanagement`
--
ALTER TABLE `brandmanagement`
  ADD PRIMARY KEY (`No`,`BrandID`),
  ADD UNIQUE KEY `ProductID` (`ProductID`);

--
-- Indexes for table `customermanagement`
--
ALTER TABLE `customermanagement`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `No` (`No`),
  ADD UNIQUE KEY `EmployeeID` (`EmployeeID`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `No_2` (`No`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Password` (`Password`),
  ADD UNIQUE KEY `ID` (`ID`) USING BTREE;

--
-- Indexes for table `lostitems`
--
ALTER TABLE `lostitems`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `InventoryID` (`InventoryID`,`ProductID`);

--
-- Indexes for table `managerinventory`
--
ALTER TABLE `managerinventory`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `ID` (`ID`),
  ADD UNIQUE KEY `InventoryID` (`InventoryID`),
  ADD UNIQUE KEY `ProductID` (`ProductID`),
  ADD UNIQUE KEY `No` (`No`),
  ADD KEY `PurchasePrice` (`PurchasePrice`),
  ADD KEY `SellingPrice` (`SellingPrice`);

--
-- Indexes for table `paymentmanagement`
--
ALTER TABLE `paymentmanagement`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `PurchaseID` (`PurchaseID`),
  ADD KEY `PurchasePrice` (`PurchasePrice`),
  ADD KEY `InventoryID` (`InventoryID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `salestracking`
--
ALTER TABLE `salestracking`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `InventoryID` (`InventoryID`,`EmployeeID`,`ProductID`),
  ADD KEY `InventoryID_2` (`InventoryID`,`ProductID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `InventoryID` (`InventoryID`,`Email`,`Password`),
  ADD KEY `ID` (`ID`,`Email`),
  ADD KEY `Password` (`Password`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admininventory`
--
ALTER TABLE `admininventory`
  MODIFY `No` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `brandmanagement`
--
ALTER TABLE `brandmanagement`
  MODIFY `No` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customermanagement`
--
ALTER TABLE `customermanagement`
  MODIFY `No` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

--
-- AUTO_INCREMENT for table `managerinventory`
--
ALTER TABLE `managerinventory`
  MODIFY `No` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1243;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `purchase_ibfk_10` FOREIGN KEY (`ProductID`) REFERENCES `salestracking` (`ProductID`),
  ADD CONSTRAINT `purchase_ibfk_2` FOREIGN KEY (`InventoryID`) REFERENCES `managerinventory` (`InventoryID`),
  ADD CONSTRAINT `purchase_ibfk_3` FOREIGN KEY (`ProductID`) REFERENCES `managerinventory` (`ProductID`),
  ADD CONSTRAINT `purchase_ibfk_4` FOREIGN KEY (`PurchasePrice`) REFERENCES `managerinventory` (`SellingPrice`),
  ADD CONSTRAINT `purchase_ibfk_5` FOREIGN KEY (`InventoryID`) REFERENCES `admininventory` (`ID`),
  ADD CONSTRAINT `purchase_ibfk_6` FOREIGN KEY (`ProductID`) REFERENCES `brandmanagement` (`ProductID`),
  ADD CONSTRAINT `purchase_ibfk_7` FOREIGN KEY (`InventoryID`) REFERENCES `lostitems` (`InventoryID`),
  ADD CONSTRAINT `purchase_ibfk_8` FOREIGN KEY (`InventoryID`) REFERENCES `users` (`InventoryID`),
  ADD CONSTRAINT `purchase_ibfk_9` FOREIGN KEY (`InventoryID`) REFERENCES `salestracking` (`InventoryID`);

--
-- Constraints for table `salestracking`
--
ALTER TABLE `salestracking`
  ADD CONSTRAINT `salestracking_ibfk_1` FOREIGN KEY (`InventoryID`) REFERENCES `admininventory` (`ID`),
  ADD CONSTRAINT `salestracking_ibfk_10` FOREIGN KEY (`InventoryID`) REFERENCES `users` (`InventoryID`),
  ADD CONSTRAINT `salestracking_ibfk_11` FOREIGN KEY (`InventoryID`) REFERENCES `users` (`InventoryID`),
  ADD CONSTRAINT `salestracking_ibfk_12` FOREIGN KEY (`EmployeeID`) REFERENCES `users` (`ID`),
  ADD CONSTRAINT `salestracking_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `brandmanagement` (`ProductID`),
  ADD CONSTRAINT `salestracking_ibfk_3` FOREIGN KEY (`EmployeeID`) REFERENCES `customermanagement` (`EmployeeID`),
  ADD CONSTRAINT `salestracking_ibfk_4` FOREIGN KEY (`InventoryID`) REFERENCES `login` (`ID`),
  ADD CONSTRAINT `salestracking_ibfk_5` FOREIGN KEY (`InventoryID`,`ProductID`) REFERENCES `lostitems` (`InventoryID`, `ProductID`),
  ADD CONSTRAINT `salestracking_ibfk_6` FOREIGN KEY (`InventoryID`) REFERENCES `managerinventory` (`InventoryID`),
  ADD CONSTRAINT `salestracking_ibfk_7` FOREIGN KEY (`ProductID`) REFERENCES `managerinventory` (`ProductID`),
  ADD CONSTRAINT `salestracking_ibfk_8` FOREIGN KEY (`InventoryID`) REFERENCES `purchase` (`InventoryID`),
  ADD CONSTRAINT `salestracking_ibfk_9` FOREIGN KEY (`ProductID`) REFERENCES `purchase` (`ProductID`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`InventoryID`) REFERENCES `admininventory` (`ID`),
  ADD CONSTRAINT `users_ibfk_10` FOREIGN KEY (`ID`) REFERENCES `paymentmanagement` (`EmployeeID`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`ID`) REFERENCES `customermanagement` (`EmployeeID`),
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`InventoryID`) REFERENCES `lostitems` (`InventoryID`),
  ADD CONSTRAINT `users_ibfk_4` FOREIGN KEY (`InventoryID`) REFERENCES `purchase` (`InventoryID`),
  ADD CONSTRAINT `users_ibfk_5` FOREIGN KEY (`ID`,`Email`) REFERENCES `login` (`ID`, `Email`),
  ADD CONSTRAINT `users_ibfk_6` FOREIGN KEY (`ID`) REFERENCES `managerinventory` (`ID`),
  ADD CONSTRAINT `users_ibfk_7` FOREIGN KEY (`InventoryID`) REFERENCES `managerinventory` (`InventoryID`),
  ADD CONSTRAINT `users_ibfk_8` FOREIGN KEY (`Password`) REFERENCES `login` (`Password`),
  ADD CONSTRAINT `users_ibfk_9` FOREIGN KEY (`InventoryID`) REFERENCES `salestracking` (`InventoryID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
