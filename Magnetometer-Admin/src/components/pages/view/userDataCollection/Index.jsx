import React, { useState, useEffect, Fragment, createRef } from 'react';
import { Card, CardBody, CardHeader, Table as TableModal } from "reactstrap";
import { Table, Layout, Button, Form } from 'antd';
import Http from '../../../security/Http';
import { errorResponse } from "../../../helpers/response";
import url from "../../../../Development.json";
import { CSVLink } from "react-csv"


const Index = () => {
    // const [form] = Form.useForm();
    const [dataTableData, setDataTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [filterText, setFilterText] = useState('');
    const [dataTableDataExport, setDataTableDataExport] = useState([]);
    const ref = createRef();

    const { Content } = Layout;
    let currentFilterText = '';

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //  Start here crud related function
    const getData = async (page = pageNo, perPage = 10, sortField = 'createdAt', sortDirection = 'descend') => {
        let options = `?page=${page}&per_page=${perPage}&delay=1&sort_direction=${sortDirection}&sort_field=${sortField}&search=${currentFilterText}`;
        await Http.get(process.env.REACT_APP_BASE_URL + url.sensor_data + options)
            .then((response) => {
                setLoading(false);
                setDataTableData(response.data.data.docs);
                setTotalRows(response.data.data.total);
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    }

    const dateFormate = (dataDate) => {
        const currentDate = new Date(dataDate);

        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const hour = currentDate.toLocaleTimeString();
        
        const dateString = `${currentDayOfMonth}-${currentMonth + 1}-${currentYear} ${hour}`;
        return dateString;
    }

    useEffect(() => {
        // eslint-disable-next-line array-callback-return
        const newArray = [];
        if (dataTableData && dataTableData.length > 0) {

            dataTableData.map(async (item, i) => {
                let objStr = {}
                item.sensordata.allMagneticData.map(key => {
                    objStr['dateTime'] = key.dateTime;
                    objStr['sensorHorizontal'] = key.sensorHorizontal;
                    objStr['sensorVertical'] = key.sensorVertical;
                    objStr['tesla'] = key.tesla;
                    objStr['tileX'] = key.tileX;
                    objStr['tileY'] = key.tileY;
                    objStr['tileZ'] = key.tileZ;
                })
                let obj = {};
                obj['Id'] = item._id;
                obj['Address'] = item.address;
                obj['sensorHorizontal'] = objStr['sensorHorizontal'];
                obj['sensorVertical'] = objStr['sensorVertical'];
                obj['tesla'] = objStr.tesla;
                obj['tileX'] = objStr.tileX;
                obj['tileY'] = objStr.tileY;
                obj['tileZ'] = objStr.tileZ;
                obj['Date-Time'] = dateFormate(item.createdAt);
                newArray.push(obj);
            })
        }
        setDataTableDataExport(newArray);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataTableData]);

    const columnsAnt = [
        {
            title: 'Id',
            dataIndex: '_id',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Date-Time',
            dataIndex: 'createdAt',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            render: item => {
                const date = dateFormate(item);
                return (
                    <tr><td>{date}</td></tr>
                )
            }
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Sensor Data',
            dataIndex: 'sensordata',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            render: item => {
                return (
                    item?.allMagneticData?.map((key) => {
                        return (
                            <>
                                <tr>sensorHorizontal: <td>{key.sensorHorizontal}</td></tr>
                                <tr>sensorVertical: <td>{key.sensorVertical}</td></tr>
                                <tr>tesla: <td>{key.tesla}</td></tr>
                                <tr>tileX: <td>{key.tileX}</td></tr>
                                <tr>tileY: <td>{key.tileY}</td></tr>
                                <tr>tileZ: <td>{key.tileZ}</td></tr>
                            </>
                        )
                    })
                )
            }
        }
    ];
    const filterComponentHandleChange = (event) => {
        currentFilterText = event.target.value;
        setFilterText(currentFilterText);
        getData();
    }

    const onChange = (pagination, filters, sorter, extra) => {
        setPageNo(pagination.current)
        getData(pagination.current, pagination.pageSize, sorter.field, sorter.order)
    }

    return (
        <Fragment>
            <Content className="site-layout-background">
                <div className="page-card-view">
                    <Card>
                        <CardHeader className="card-header-part">
                            <h5>Data Collection</h5>
                            <div className="card-header-action ml-3">

                                <div className="d-flex justify-content-end mobile-view-search-export">
                                    <Button className='export-button my-button'>
                                        <CSVLink
                                            filename={new Date().toLocaleString() + ".csv"}
                                            data={dataTableDataExport}
                                        >
                                            Export to CSV
                                        </CSVLink>
                                    </Button>
                                    <div className="form-group mb-0 mr-3 width-100pr">
                                        <input type="text"
                                            className="form-control"
                                            id="search"
                                            placeholder="Search"
                                            value={filterText}
                                            onChange={(event) => filterComponentHandleChange(event)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="table-part table-style-1" ref={ref}>

                                <div className="table-responsive">
                                    <Table
                                        columns={columnsAnt}
                                        dataSource={dataTableData}
                                        rowKey={"_id"}
                                        loading={loading}
                                        pagination={{
                                            total: totalRows,
                                            showSizeChanger: true
                                        }}
                                        onChange={onChange}
                                        exportable={true}
                                        exportableProps={{ showColumnPicker: true }}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </Content>
        </Fragment>
    );
}

export default Index;
