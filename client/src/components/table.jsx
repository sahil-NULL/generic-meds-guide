import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns = [
  { 
    field: 'name', 
    headerName: 'Name', 
    minWidth: 100, 
    flex: 1, 
    headerAlign: 'center', 
    align: 'center', 
    sortable: false 
  },
  { 
    field: 'brand', 
    headerName: 'Brand', 
    minWidth: 100, 
    flex: 1, 
    headerAlign: 'center', 
    align: 'center', 
    sortable: false 
  },
  {
    field: 'unitPrice',
    headerName: 'Price',
    headerAlign: 'center',
    align: 'center',
    minWidth: 50,
    flex: 1,
    // Store raw number value in unitPriceValue field for sorting
    sortComparator: (v1, v2) => v1.rawValue - v2.rawValue,
    // Render the formatted price string
    renderCell: (params) => params.value.formatted,
    sortable: true,
    sortingOrder: ['asc', 'desc'] 
  }
];

const paginationModel = { page: 0, pageSize: 10 };

function Table(props) {
    const setId = (results) => {
        return results.map(result => {
            const rawUnitPrice = result.price / result.quantity;
            const formattedPrice = `₹ ${rawUnitPrice.toFixed(2)} /${result.unit}`;
            
            const newResult = {
                ...result,
                id: result._id,
                name: result.name.toLowerCase(),
                // Store both raw value and formatted string
                unitPrice: {
                    rawValue: rawUnitPrice,
                    formatted: formattedPrice
                }
            }
            return newResult;
        });
    }

    const newResults = setId(props.results);
    
    return (
        <div className='flex justify-center w-screen my-16'>
            <Paper sx={{ 
                    height: '100%', 
                    width: '80%',
                    backgroundColor: '#333333', // Dark gray background for Paper
                    border: '2px solid #4CAF50' // Green border
                }}>
                <DataGrid
                    rows={newResults}
                    columns={columns}
                    initialState={{ 
                        pagination: { paginationModel },
                        sorting: {
                            sortModel: [{ field: 'unitPrice', sort: 'asc' }]
                        }
                    }}
                    pageSizeOptions={[10, 20, 30]}
                    sx={{ 
                        border: 0,
                        backgroundColor: '#333333',
                        color: 'white',
                        '& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderTitle': {
                            backgroundColor: '#333333 !important',
                            color: 'white !important',
                            borderBottom: 'none !important',
                            outline: 'none !important'
                        },
                        fontSize: {
                            xs: '0.75rem',    // 12px
                            sm: '0.875rem',   // 14px
                            md: '1rem',       // 16px
                            lg: '1.125rem',   // 18px
                            xl: '1.25rem'     // 20px
                        },
                        // Style for header icons
                        '& .MuiDataGrid-iconButtonContainer': {
                            color: 'white !important',
                        },
                        '& .MuiDataGrid-sortIcon': {
                            color: 'white !important',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none',
                            borderRight: 'none',
                            paddingX: 1,
                            textTransform: 'capitalize'
                        },
                        '& .MuiDataGrid-row': {
                            borderBottom: 'none',
                            borderTop: 'none',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            backgroundColor: '#404040',
                            borderTop: 'none',
                            color: 'white',
                        },
                        '& .MuiTablePagination-root': {
                            color: 'white',
                        },
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            fontWeight: 'bold'
                        },
                        '& .MuiDataGrid-columnHeader:focus': {
                            outline: 'none',
                        },
                        // Pagination controls styling
                        '& .MuiIconButton-root': {
                            color: 'white',
                        },
                        '& .MuiDataGrid-menuIcon': {
                            color: 'white',
                        },
                        
                        // Scrollbars styling
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                            width: '8px',
                            height: '8px',
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                            background: '#404040',
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                            backgroundColor: '#666666',
                            borderRadius: '4px',
                        },
                    }}
                />
            </Paper>
        </div>
    );
}

export default Table;