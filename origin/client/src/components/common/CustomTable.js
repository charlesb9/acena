import React from 'react'
import Paper from '@material-ui/core/Paper';
import MUIDataTable from "mui-datatables";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import TableHead from './TableHead'
import useCheckMobile from '../../utils/useCheckMobile';

const useStyles = makeStyles((theme, props) => ({
  grey: {
    '& td': { backgroundColor: '#fafafa', },
  },
  white: {
    '& td': { backgroundColor: '#FFF' },
  },
  grid: {
    '& td': { borderRight: '1px solid #8080802b', textAlign: 'center' },
    '& td:last-of-type': { borderRight: 'none' },
    '& td:first-of-type': {
      textAlign: props => props.isMobile ? 'center' : 'left'
    },
  },
}));

function CustomTable({ data, headCells, preHeadCells, rowsPerPage = 10, preHeader, dense, grid = false, filter = true, sortOrder }) {
  const isMobile = useCheckMobile()
  const classes = useStyles({ isMobile })
  const { t } = useTranslation()

  return (
    <MUIDataTable
      title={preHeader}
      data={data}
      columns={headCells}
      components={preHeadCells && {
        TableHead: (props) => <TableHead {...props} preHeadCells={preHeadCells} />
      }}
      options={
        {
          setTableProps: () => {
            return {
              padding: dense ? 'none' : 'default',
              size: dense ? 'small' : 'medium',
              className: clsx({
                [classes.grid]: grid
              }),
            };
          },
          setRowProps: (row, dataIndex, rowIndex) => {
            return {
              className: clsx({
                [classes.grey]: rowIndex % 2 === 1,
                [classes.white]: rowIndex % 2 === 0,
                [classes.grid]: grid
              }),
            };
          },
          fixedHeader: false,
          print: false,
          sort: !isMobile,
          searchPlaceholder: "Rechercher dans la table...",
          elevation: 1,
          selectableRows: 'none',
          filter: filter,
          sortOrder,
          textLabels: {
            body: {
              noMatch: t('no_data'),
              toolTip: t('sort'),
              columnHeaderTooltip: column => t('sort_by', { name: column.label })
            },
            pagination: {
              next: t('next_page'),
              previous: t('prev_page'),
              rowsPerPage: t('items_by_page'),
              displayRows: t('on'),
            },
            toolbar: {
              search: t('search'),
              downloadCsv: t('download'),
              viewColumns: t('columns'),
              filterTable: t('filter'),
            },
            filter: {
              all: t('all'),
              title: t('filters'),
              reset: t('reset'),
            },
            viewColumns: {
              title: t('show_columns'),
              titleAria: t('show_columns'),
            },
          }
        }

      }
    />
  )
}

export default CustomTable