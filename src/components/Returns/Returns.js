// import React, { useState } from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import TableFooter from "@mui/material/TableFooter";
// import TablePagination from "@mui/material/TablePagination";
// import Button from '@mui/material/Button';

// const initialPayments = [
//   {
//     orderNumber: "ORD12345",
//     customerName: "John Doe",
//     dispatchedDate: "2024-08-15",
//     amount: "₹100",
//     status: "Return",
//     type: "Return",
//   },
//   {
//     orderNumber: "ORD12346",
//     customerName: "Jane Smith",
//     dispatchedDate: "2024-08-16",
//     amount: "₹150",
//     status: "Replacement",
//     type: "Replacement",
//   },
//   // Add more initial data if needed
// ];

// export default function Payments() {
//   const [payments, setPayments] = useState(initialPayments);
//   const [filteredPayments, setFilteredPayments] = useState(initialPayments);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   const handleFilterChange = (filter) => {
//     if (filter === "All") {
//       setFilteredPayments(payments);
//     } else {
//       setFilteredPayments(payments.filter(payment => payment.type === filter));
//     }
//     setSelectedFilter(filter);
//     setPage(0);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const emptyRows =
//     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredPayments.length) : 0;

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto">
//       <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
//         {/* Header and filter buttons section */}
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold mb-4">Returns</h2>
//           <div className="flex justify-center space-x-2">
//             <Button
//               variant="contained"
//               style={{
//                 backgroundColor: selectedFilter === "All" ? '#003375' : '#d1d5db',
//                 color: selectedFilter === "All" ? 'white' : '#1f2937',
//                 borderRadius: '0.375rem'
//               }}
//               onClick={() => handleFilterChange("All")}
//             >
//               All
//             </Button>
//             <Button
//               variant="contained"
//               style={{
//                 backgroundColor: selectedFilter === "Return" ? '#003375' : '#d1d5db',
//                 color: selectedFilter === "Return" ? 'white' : '#1f2937',
//                 borderRadius: '0.375rem'
//               }}
//               onClick={() => handleFilterChange("Return")}
//             >
//               Return
//             </Button>
//             <Button
//               variant="contained"
//               style={{
//                 backgroundColor: selectedFilter === "Replacement" ? '#003375' : '#d1d5db',
//                 color: selectedFilter === "Replacement" ? 'white' : '#1f2937',
//                 borderRadius: '0.375rem'
//               }}
//               onClick={() => handleFilterChange("Replacement")}
//             >
//               Replacement
//             </Button>
//           </div>
//         </div>

//         {/* Table section */}
//         <TableContainer component={Paper} className="bg-white rounded-lg shadow-md">
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell style={{ backgroundColor: '#003375', color: 'white', fontWeight: 'bold' }}>Order Id</TableCell>
//                 <TableCell style={{ backgroundColor: '#003375', color: 'white', fontWeight: 'bold' }}>Customer Name</TableCell>
//                 <TableCell style={{ backgroundColor: '#003375', color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
//                 <TableCell style={{ backgroundColor: '#003375', color: 'white', fontWeight: 'bold' }}>Dispatched Date</TableCell>
//                 <TableCell style={{ backgroundColor: '#003375', color: 'white', fontWeight: 'bold' }}>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredPayments
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((item, index) => (
//                   <TableRow
//                     key={index}
//                     className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
//                   >
//                     <TableCell class="py-4 px-6 text-sm text-gray-500">{item.orderNumber}</TableCell>
//                     <TableCell class="py-4 px-6 text-sm text-gray-500">{item.customerName}</TableCell>
//                     <TableCell class="py-4 px-6 text-sm text-gray-500">{item.amount}</TableCell>
//                     <TableCell class="py-4 px-6 text-sm text-gray-500">{item.dispatchedDate}</TableCell>
//                     <TableCell className="text-center" class="py-4 px-6 text-sm text-gray-500">
//                       <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
//                         ${item.status === "Return" ? 'bg-red-200 text-red-800' :
//                           item.status === "Replacement" ? 'bg-green-200 text-green-800' : ''}`}>
//                         {item.status}
//                       </span>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: 53 * emptyRows }}>
//                   <TableCell colSpan={5} />
//                 </TableRow>
//               )}
//             </TableBody>
//             <TableFooter>
//               <TableRow>
//                 <TablePagination
//                 class="py-4 px-6 text-sm text-gray-500"
//                   rowsPerPageOptions={[5, 10, 25]}
//                   colSpan={5}
//                   count={filteredPayments.length}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   SelectProps={{
//                     inputProps: {
//                       'aria-label': 'rows per page',
//                     },
//                     native: true,
//                   }}
//                   onPageChange={handleChangePage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   className="text-sm"
//                 />
//               </TableRow>
//             </TableFooter>
//           </Table>
//         </TableContainer>
//       </div>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import TableFooter from "@mui/material/TableFooter";
// import TablePagination from "@mui/material/TablePagination";
// import Button from '@mui/material/Button';
// import {
//   StyledTableCell,
//   StyledTableRow,
//   TablePaginationActions,
// } from "../CustomTablePagination";

// const initialPayments = [
//   {
//     orderNumber: "ORD12345",
//     customerName: "John Doe",
//     dispatchedDate: "2024-08-15",
//     amount: "₹100",
//     status: "Return",
//     type: "Return",
//   },
//   {
//     orderNumber: "ORD12346",
//     customerName: "Jane Smith",
//     dispatchedDate: "2024-08-16",
//     amount: "₹150",
//     status: "Replacement",
//     type: "Replacement",
//   },
//   {
//     orderNumber: "ORD12345",
//     customerName: "John Doe",
//     dispatchedDate: "2024-08-15",
//     amount: "₹100",
//     status: "Return",
//     type: "Return",
//   },
//   {
//     orderNumber: "ORD12346",
//     customerName: "Jane Smith",
//     dispatchedDate: "2024-08-16",
//     amount: "₹150",
//     status: "Replacement",
//     type: "Replacement",
//   },
//   {
//     orderNumber: "ORD12345",
//     customerName: "John Doe",
//     dispatchedDate: "2024-08-15",
//     amount: "$100",
//     status: "Return",
//     type: "Return",
//   },
//   {
//     orderNumber: "ORD12346",
//     customerName: "Jane Smith",
//     dispatchedDate: "2024-08-16",
//     amount: "$150",
//     status: "Replacement",
//     type: "Replacement",
//   },
//   {
//     orderNumber: "ORD12345",
//     customerName: "John Doe",
//     dispatchedDate: "2024-08-15",
//     amount: "$100",
//     status: "Return",
//     type: "Return",
//   },
//   {
//     orderNumber: "ORD12346",
//     customerName: "Jane Smith",
//     dispatchedDate: "2024-08-16",
//     amount: "$150",
//     status: "Replacement",
//     type: "Replacement",
//   },
//   // Add more initial data if needed
// ];

// export default function Payments() {
//   const [payments, setPayments] = useState(initialPayments);
//   const [filteredPayments, setFilteredPayments] = useState(initialPayments);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   const handleFilterChange = (filter) => {
//     if (filter === "All") {
//       setFilteredPayments(payments);
//     } else {
//       setFilteredPayments(payments.filter(payment => payment.type === filter));
//     }
//     setSelectedFilter(filter);
//     setPage(0);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const emptyRows =
//     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredPayments.length) : 0;

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto">
//       <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
//         {/* Header and filter buttons section */}
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold mb-4">Services</h2>
//           <div className="flex justify-center space-x-2">
//             <Button
//               variant="contained"
//               style={{
//                 backgroundColor: selectedFilter === "All" ? '#003375' : '#d1d5db',
//                 color: selectedFilter === "All" ? 'white' : '#1f2937',
//                 borderRadius: '0.375rem'
//               }}
//               onClick={() => handleFilterChange("All")}
//             >
//               All
//             </Button>
//             <Button
//               variant="contained"
//               style={{
//                 backgroundColor: selectedFilter === "Return" ? '#003375' : '#d1d5db',
//                 color: selectedFilter === "Return" ? 'white' : '#1f2937',
//                 borderRadius: '0.375rem'
//               }}
//               onClick={() => handleFilterChange("Return")}
//             >
//               Return
//             </Button>
//             <Button
//               variant="contained"
//               style={{
//                 backgroundColor: selectedFilter === "Replacement" ? '#003375' : '#d1d5db',
//                 color: selectedFilter === "Replacement" ? 'white' : '#1f2937',
//                 borderRadius: '0.375rem'
//               }}
//               onClick={() => handleFilterChange("Replacement")}
//             >
//               Replacement
//             </Button>
//           </div>
//         </div>

//         {/* Table section */}
//         <TableContainer component={Paper} className="bg-white rounded-lg shadow-md">
//           <Table>
//             <TableHead>
//               <TableRow>
//               <StyledTableCell style={{ backgroundColor: '#003375', color: 'white', fontWeight: 'bold' }}>Order Id </StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#003375', color: 'white', fontWeight: 'bold' }}>Customer Name</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#003375', color: 'white', fontWeight: 'bold' }}>Amount</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#003375', color: 'white', fontWeight: 'bold' }}>Dispatched Date</StyledTableCell>
//               <StyledTableCell style={{ backgroundColor: '#003375', color: 'white', fontWeight: 'bold' }}>Status</StyledTableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredPayments
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((item, index) => (
//                   <TableRow
//                     key={index}
//                     className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
//                   >
//                   <StyledTableCell>{item.orderNumber}</StyledTableCell>
//                   <StyledTableCell>{item.customerName}</StyledTableCell>
//                     <StyledTableCell>{item.amount}</StyledTableCell>
//                     <StyledTableCell>{item.dispatchedDate}</StyledTableCell>
//                     <StyledTableCell className="text-center">
//                       <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
//                         ${item.status === "Return" ? 'bg-red-200 text-red-800' :
//                           item.status === "Replacement" ? 'bg-green-200 text-green-800' : ''}`}>
//                         {item.status}
//                       </span>
//                       </StyledTableCell>
//                   </TableRow>
//                 ))}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: 53 * emptyRows }}>
//                   <TableCell colSpan={5} />
//                 </TableRow>
//               )}
//             </TableBody>
//             <TableFooter>
//               <TableRow>
//                 <TablePagination
//                   rowsPerPageOptions={[5, 10, 25]}
//                   colSpan={5}
//                   count={filteredPayments.length}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   SelectProps={{
//                     inputProps: {
//                       'aria-label': 'rows per page',
//                     },
//                     native: true,
//                   }}
//                   onPageChange={handleChangePage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   className="text-sm"
//                 />
//               </TableRow>
//             </TableFooter>
//           </Table>
//         </TableContainer>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Button from '@mui/material/Button';
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";

const initialPayments = [
  {
    orderNumber: "ORD12345",
    customerName: "John Doe",
    dispatchedDate: "2024-08-15",
    amount: "₹100",
    status: "Return",
    type: "Return",
  },
  {
    orderNumber: "ORD12346",
    customerName: "Jane Smith",
    dispatchedDate: "2024-08-16",
    amount: "₹150",
    status: "Replacement",
    type: "Replacement",
  },
  {
    orderNumber: "ORD12345",
    customerName: "John Doe",
    dispatchedDate: "2024-08-15",
    amount: "₹100",
    status: "Return",
    type: "Return",
  },
  {
    orderNumber: "ORD12346",
    customerName: "Jane Smith",
    dispatchedDate: "2024-08-16",
    amount: "₹150",
    status: "Replacement",
    type: "Replacement",
  },
  {
    orderNumber: "ORD12345",
    customerName: "John Doe",
    dispatchedDate: "2024-08-15",
    amount: "$100",
    status: "Return",
    type: "Return",
  },
  {
    orderNumber: "ORD12346",
    customerName: "Jane Smith",
    dispatchedDate: "2024-08-16",
    amount: "$150",
    status: "Replacement",
    type: "Replacement",
  },
  {
    orderNumber: "ORD12345",
    customerName: "John Doe",
    dispatchedDate: "2024-08-15",
    amount: "$100",
    status: "Return",
    type: "Return",
  },
  {
    orderNumber: "ORD12346",
    customerName: "Jane Smith",
    dispatchedDate: "2024-08-16",
    amount: "$150",
    status: "Replacement",
    type: "Replacement",
  },
  // Add more initial data if needed
];

export default function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [filteredPayments, setFilteredPayments] = useState(initialPayments);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleFilterChange = (filter) => {
    if (filter === "All") {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(payments.filter(payment => payment.type === filter));
    }
    setSelectedFilter(filter);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredPayments.length) : 0;

  return (
    <div className="main-container">
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        {/* Header and filter buttons section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Services</h2>
          <div className="flex justify-center space-x-2">
            <Button
              variant="contained"
              style={{
                backgroundColor: selectedFilter === "All" ? '#003375' : '#d1d5db',
                color: selectedFilter === "All" ? 'white' : '#1f29337',
                borderRadius: '0.375rem'
              }}
              onClick={() => handleFilterChange("All")}
            >
              All
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: selectedFilter === "Return" ? '#003375' : '#d1d5db',
                color: selectedFilter === "Return" ? 'white' : '#1f29337',
                borderRadius: '0.375rem'
              }}
              onClick={() => handleFilterChange("Return")}
            >
              Return
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: selectedFilter === "Replacement" ? '#003375' : '#d1d5db',
                color: selectedFilter === "Replacement" ? 'white' : '#1f29337',
                borderRadius: '0.375rem'
              }}
              onClick={() => handleFilterChange("Replacement")}
            >
              Replacement
            </Button>
          </div>
        </div>

        {/* Table section */}
        <TableContainer component={Paper} className="bg-white rounded-lg shadow-md">
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Order Id</StyledTableCell>
                <StyledTableCell>Customer Name</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Dispatched Date</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{item.orderNumber}</StyledTableCell>
                    <StyledTableCell>{item.customerName}</StyledTableCell>
                    <StyledTableCell>{item.amount}</StyledTableCell>
                    <StyledTableCell>{item.dispatchedDate}</StyledTableCell>
                    <StyledTableCell className="text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                        ${item.status === "Return" ? 'bg-red-200 text-red-800' :
                          item.status === "Replacement" ? 'bg-green-200 text-green-800' : ''}`}>
                        {item.status}
                      </span>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <StyledTableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={5}
                  count={filteredPayments.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions} // Use custom pagination actions
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
