import React, { useState, useEffect, Fragment, createRef } from 'react';
import { Card, CardBody, CardHeader, Table as TableModal } from "reactstrap";
import { Table, Modal, Layout, Button, Tooltip, Form, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useNavigate } from 'react-router-dom';
import { faTrashAlt, faEye, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Http from '../../../security/Http';
import { errorResponse, successResponse, validateMessages } from "../../../helpers/response";
import url from "../../../../Development.json";
import { CSVLink } from "react-csv"



const Index = () => {
    const [form] = Form.useForm();
    const [dataTableData, setDataTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [filterText, setFilterText] = useState('');
    const [visible, setVisible] = useState(false);
    const [viewModalText, setviewModalText] = useState();
    const [dataTableDataExport, setDataTableDataExport] = useState([]);
    const [addUserModalVisible, setAddUserModalVisible] = useState(false);
    const [profileData, setProfileData] = useState()
    const ref = createRef();

    // const navigate = useNavigate();
    const { Content } = Layout;
    let currentFilterText = '';

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //  Start here crud related function
    const getData = async (page = pageNo, perPage = 10, sortField = 'createdAt', sortDirection = 'descend') => {
        let options = `?page=${page}&per_page=${perPage}&delay=1&sort_direction=${sortDirection}&sort_field=${sortField}&search=${currentFilterText}`; //&type=1
        await Http.get(process.env.REACT_APP_BASE_URL + url.user_get + options)
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

    useEffect(() => {
        // eslint-disable-next-line array-callback-return
        const newArray = []; // Create a copy
        if (dataTableData && dataTableData.length > 0) {

            dataTableData.map(async (item, i) => {
                let obj = {};
                obj['My-user Id'] = item._id;
                obj['First Name'] = item.first_name;
                obj['Last Name'] = item.last_name;
                obj['Role'] = item.is_admin;
                obj['Mobile No'] = item.mobile_no;
                obj['Email'] = item.email;
                newArray.push(obj);
            })
            setProfileData(JSON.parse(localStorage.getItem("profile")))
        }
        setDataTableDataExport(newArray);

        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [dataTableData]);


    const columnsAnt = [
        {
            title: 'My-user Id',
            dataIndex: '_id',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Role',
            dataIndex: 'is_admin',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Mobile No',
            dataIndex: 'mobile_no',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Action',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <div className='action-btn my-theme-color-button'>
                        <Tooltip title="View">
                            <Button type="primary" onClick={(e) => showRowDataModal(row)}>
                                <FontAwesomeIcon icon={faEye} />
                            </Button>
                        </Tooltip>

                        {/* <Tooltip title="Chat">
                            <Button type="primary" className="" onClick={(id) => { chatButtonClick(row._id) }}>
                                <FontAwesomeIcon icon={faComment} />
                            </Button>
                        </Tooltip> */}

                        {(profileData?.is_admin === "sub_admin" || profileData?.is_admin === "sub-admin") ? <></> :
                            <>
                                <Tooltip title="Change status">
                                    <Button type="primary" onClick={(e) => changeStatusButtonClick(row._id, row.is_active === "true" ? "false" : "true")}>
                                        {
                                            row.is_active === "true" ? <FontAwesomeIcon icon={faToggleOff} /> : <FontAwesomeIcon icon={faToggleOn} />
                                        }
                                    </Button>
                                </Tooltip>

                                <Tooltip title="Delete">
                                    <Button type="primary" onClick={(id) => { deleteButtonClick(row._id) }} >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </Button>
                                </Tooltip>
                            </>}


                        {/* <Tooltip title="Email Notification status">
                            <Button type="primary" onClick={(e) => changeStatusEmailButtonClick(row._id, row.email_is_active === true ? "false" : "true")}>
                                {
                                    row.email_is_active === true ? <IoIosNotifications icon={faToggleOff} /> : <IoMdNotificationsOff icon={faToggleOn} />
                                }
                            </Button>
                        </Tooltip> */}
                        {/* <Tooltip title="Firebase Notification status">
                            <Button type="primary" onClick={(e) => changeStatusFirebaseButtonClick(row._id, row.firebase_is_active === true ? "false" : "true")}>
                                {
                                    row.firebase_is_active === true ? <FontAwesomeIcon icon={faToggleOff} /> : <FontAwesomeIcon icon={faToggleOn} />
                                }
                            </Button>
                        </Tooltip> */}

                    </div>
                );
            },
        },
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

    const deleteButtonClick = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let obj = `?id=${id}`;
                await Http
                    .del(process.env.REACT_APP_BASE_URL + url.user_delete + obj)
                    .then((response) => {
                        getData();
                        successResponse(response);
                    })
                    .catch((error) => {
                        if (error.response) {
                            errorResponse(error);
                        }
                    });
            }
        })
    };

    const changeStatusButtonClick = async (id, status) => {

        const obj = {
            id: id,
            status: status,
        };

        await Http.post(process.env.REACT_APP_BASE_URL + url.user_change_status, obj)
            .then((response) => {
                successResponse(response);
                getData();
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    };


    const showRowDataModal = (row) => {

        const onFinishPassword = async (e) => {
            const data = {
                user_id: row._id,
                password: e.new_password,
                updated_by: `${JSON.parse(localStorage.getItem("profile")).first_name} ${JSON.parse(localStorage.getItem("profile")).last_name}`
            }
            await Http
                .post(process.env.REACT_APP_BASE_URL + url.change_user_password, data)
                .then((response) => {
                    handleViewModelCancel()
                    form.resetFields();
                    successResponse(response);
                })
                .catch((error) => {
                    if (error.response) {
                        errorResponse(error);
                    }
                });

        }

        let TableModaldata = (
            <div className="table-responsive">
                <TableModal striped bordered hover className="cr-table">
                    <tbody>
                        <tr>
                            <th>My-user Id</th>
                            <td>{row._id}</td>
                        </tr>
                        <tr>
                            <th>First Name</th>
                            <td>{row.first_name}</td>
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td>{row.last_name}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{row.email}</td>
                        </tr>
                        <tr>
                            <th>Mobile No</th>
                            <td>{row.mobile_no}</td>
                        </tr>

                        {(profileData?.is_admin === "sub_admin" || profileData?.is_admin === "sub-admin") ? <></> : <>
                            <tr>
                                <th>Change Password</th>
                                <td>
                                    <Form form={form}
                                        name="basic"
                                        layout="vertical"
                                        onFinish={onFinishPassword}
                                        validateMessages={validateMessages()}
                                        autoComplete="off"
                                        className="m-5"
                                    >
                                        <Form.Item
                                            label="New Password"
                                            name="new_password"
                                            id="new_password"
                                            rules={[
                                                {
                                                    required: true,
                                                    type: 'string',
                                                    min: 6,
                                                    max: 39,
                                                },
                                            ]}
                                        >
                                            <Input min={6} />
                                        </Form.Item>
                                        <Form.Item
                                            wrapperCol={{
                                                offset: 8,
                                                span: 16,
                                            }}
                                        >
                                            <Button type="primary" className='my-submit-button' htmlType="submit" >
                                                Update
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </td>
                            </tr>

                        </>}

                        <tr>
                            <th>Is Active</th>
                            <td><span className={`btn btn-sm   ${row.is_active === "true" ? "btn-success" : "btn-danger"}`}>
                                {
                                    row.is_active === "true" ? "Yes" : "No"
                                }
                            </span>
                            </td>
                        </tr>

                    </tbody>
                </TableModal>
            </div>
        )
        setviewModalText(TableModaldata);
        setVisible(true);
    };

    const handleViewModelCancel = () => {
        form.resetFields();
        setVisible(false);
    };
    //  End here crud related function
    const openAddUserModal = () => {
        form.resetFields();
        setAddUserModalVisible(true);
    };
    const submitUserData = async (userData) => {
        try {
            setLoading(true);
            const response = await Http.post(process.env.REACT_APP_BASE_URL + url.user_store, userData);

            if (response.data.message.startsWith("User Already exists")) {
                successResponse(response);
                setLoading(false);
            } else {
                successResponse(response);
                setAddUserModalVisible(false);
                form.resetFields();
                getData();
                setLoading(false);
            }
        } catch (error) {
            if (error.response) {
                errorResponse(error);
            }
        }
    };
    let addUserForm = (
        <div className="table-responsive" >
            <Form
                form={form}
                name="addUserForm"
                onFinish={submitUserData}
                validateMessages={validateMessages()}
                autoComplete="off"
                className="m-5"
            >
                <table className="cr-table">
                    <tbody>
                        <tr>
                            <th style={{ verticalAlign: 'top' }}>First Name</th>
                            <th>
                                <Form.Item
                                    name="first_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your first name!',
                                        },
                                    ]}
                                >
                                    <Input style={{ marginLeft: "15px" }} />
                                </Form.Item>
                            </th>
                        </tr>
                        <tr>
                            <th style={{ verticalAlign: 'top' }}>Last Name</th>
                            <th> <Form.Item
                                // label="Username"
                                name="last_name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Last Name!',
                                    },
                                ]}
                            >
                                <Input style={{ marginLeft: "15px" }} />
                            </Form.Item></th>
                        </tr>

                        <tr>
                            <th style={{ verticalAlign: 'top' }}>Email</th>
                            <th><Form.Item
                                // label="Username"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                    {
                                        pattern: new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                                        message: "Enter valid email."
                                    }
                                ]}
                            >
                                <Input style={{ marginLeft: "15px" }} />
                            </Form.Item></th>
                        </tr>
                        <tr>
                            <th style={{ verticalAlign: 'top' }}>Password</th>
                            <th><Form.Item
                                // label="Username"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input style={{ marginLeft: "15px" }} />
                            </Form.Item></th>
                        </tr>

                        <tr>
                            <th style={{ verticalAlign: 'top', marginLeft: "15px" }}>Mobile Number</th>
                            <th><Form.Item
                                // label="Username"
                                name="mobile_no"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Mobile no, No. should be 10 digits!',
                                        max: 10
                                    },
                                    {
                                        pattern: new RegExp("^[0-9]*$"),
                                        message: "Mobile No. accept only Number."
                                    }
                                ]}
                            >
                                <Input style={{ marginLeft: "15px" }} />
                            </Form.Item></th>
                        </tr>
                    </tbody>
                </table>
                {/* </Form> */}
                <Button type="primary" className="my-submit-button" htmlType="submit" loading={loading}>
                    Add Sub-admin
                </Button>

            </Form>
        </div>
    )

    return (
        <Fragment>
            <Content className="site-layout-background">
                <Modal
                    title="Add Sub-admin"
                    centered
                    open={addUserModalVisible}
                    onCancel={() => setAddUserModalVisible(false)}
                    footer={''}
                >
                    {addUserForm}
                </Modal>
                <div className="page-card-view">
                    <Card>
                        <CardHeader className="card-header-part">
                            <h5>My User List</h5>
                            <div className="card-header-action ml-3">

                                <div className="d-flex justify-content-end mobile-view-search-export">
                                    {(profileData?.is_admin === "sub_admin" || profileData?.is_admin === "sub-admin") ? <></> :
                                        <Button className='export-button my-button' onClick={openAddUserModal}>
                                            Add Sub-admin
                                        </Button>}

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
            <Modal title="My Users Details" centered footer={''} open={visible} onCancel={handleViewModelCancel}>
                {viewModalText}
            </Modal>
        </Fragment >
    );
}

export default Index;
