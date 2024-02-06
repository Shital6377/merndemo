import React, { useEffect, useState } from "react";
import { Layout, Form, Col, Input, Row } from "antd";
import { Card, Select } from 'antd';
import ButtonSubmitReset from '../../layout/ButtonSubmitReset';
import Http from '../../../security/Http';
import { errorResponse, successResponse } from "../../../helpers/response";
import url from "../../../../Development.json";

const Index = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const { Content } = Layout;

    const [locationArr, setLocationArr] = useState([]);
    const [selestedOption, setSelectedOption] = useState([]);

    useEffect(() => {
        getSensorData();
    }, []);

    const getSensorData = async () => { // sortField = 'createdAt', sortDirection = 'descend'
        // let options = `?delay=1&sort_direction=${sortDirection}&sort_field=${sortField}`;
        await Http.get(process.env.REACT_APP_BASE_URL + url.sensor_get_location)
            .then((response) => {
                const arrayLocation = response.data.data.docs.reduce((arr, key) => {
                    if (!(arr.some(item => item.label === key.address))) {
                        arr.push({ value: key._id, label: key.address });
                    }
                    return arr;
                }, []);
                setLocationArr(arrayLocation);
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    }

    const onSubmit = async (data) => {
        setIsLoading(true);
        await Http
            .post(
                process.env.REACT_APP_BASE_URL + url.sent_notification,
                data
            )
            .then((response) => {
                setIsLoading(false);
                successResponse(response);
                form.resetFields();
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response) {
                    errorResponse(error);
                }
            });
    };

    const onFinish = (values) => {
        const data = {
            title: values.Title,
            notification_body: values.notification_text,
            location: selestedOption
        }
        onSubmit(data);
    };

    const onReset = () => {
        form.resetFields();
    };
    const selectLocationOption = (option) => {
        setSelectedOption(option);
    }


    return (
        <Content className="site-layout-background">

            <div className="site-card-border-less-wrapper center p-5 align-items-center">
                <Card title="Notification">
                    <Form form={form}
                        name="About"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={{
                            xs: 8,
                            sm: 16,
                            md: 24,
                            lg: 32,
                        }}>
                            <Col span={6} md={6} sm={12} xs={12}>
                                <Form.Item
                                    label="Select Location"
                                    name="location"
                                    id="location"
                                    rules={[
                                        {
                                            required: true,
                                        }
                                    ]}
                                >
                                    <Select options={locationArr} onChange={selectLocationOption} value={selestedOption} mode="multiple" />
                                </Form.Item>
                            </Col>
                            <Col span={6} md={6} sm={12} xs={12}>

                                <Form.Item
                                    label="Title"
                                    name="Title"
                                    id="Title"
                                    rules={[
                                        {
                                            required: true,
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Col span={8} md={8} sm={12} xs={12}>
                            <Form.Item
                                label="Notification Text"
                                name="notification_text"
                                id="notification_text"
                                rules={[
                                    {
                                        required: true,
                                        message: `Please input your text!`,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Form.Item className="text-center">
                            <ButtonSubmitReset isLoading={isLoading} onReset={onReset} />
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Content>
    )
};

export default Index;
