import React, { useEffect, useState, useRef } from "react";
import { Layout, Form } from "antd";
import { Card } from 'antd';
import ButtonSubmitReset from '../../layout/ButtonSubmitReset';
import Http from '../../../security/Http';
import { errorResponse, successResponse, configEditorInit } from "../../../helpers/response";
import url from "../../../../Development.json";
import { Editor } from "@tinymce/tinymce-react";

const Index = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const { Content } = Layout;

    const editorRef = useRef(null);

    const [info, setInfo] = useState("<p>Hello <strong>Abc &nbsp;</strong></p>");
    const [calibration, setCalibration] = useState("<p>Hello <strong>Abc &nbsp;</strong></p>");
    const [settings, setSettings] = useState("<p>Hello <strong>Abc &nbsp;</strong></p>");
    const [vibration, setVibration] = useState("<p>Hello <strong>Abc &nbsp;</strong></p>");

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        await Http
            .get(process.env.REACT_APP_BASE_URL + url.cms_edit_get)
            .then((response) => {
                let data = response.data.data;
                setInfo(data.INFO);
                setSettings(data.SETTINGS);
                setVibration(data.VIBRATION);
                setCalibration(data.CALIBRATION);

                form.setFieldsValue({
                    settings: data.SETTINGS,
                    info: data.INFO,
                    vibration: data.VIBRATION,
                    calibration: data.CALIBRATION
                });
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    };



    const onSubmit = async (data) => {
        setIsLoading(true);
        await Http
            .post(
                process.env.REACT_APP_BASE_URL + url.cms_store,
                data
            )
            .then((response) => {
                setIsLoading(false);
                successResponse(response);
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
            settings: settings,
            vibration: vibration,
            info: info,
            calibration: calibration
        }
        onSubmit(data);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Content className="site-layout-background">

            <div className="site-card-border-less-wrapper center p-5 align-items-center">
                <Card title="About">
                    <Form form={form}
                        name="About"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Settings"
                            name="settings"
                            id="settings"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Settings!`,
                                },
                            ]}
                        >
                            <Editor
                                apiKey={process.env.REACT_APP_TINYMAC_KEY}
                                value={settings}
                                onEditorChange={(value) => {
                                    setSettings(value)
                                    form.setFieldsValue({
                                        settings: value,
                                    });
                                }}
                                onInit={(evt, editor) => editorRef.current = editor}
                                init={configEditorInit()}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Info"
                            name="info"
                            id="info"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Info!`,
                                },
                            ]}
                        >
                            <Editor
                                apiKey={process.env.REACT_APP_TINYMAC_KEY}
                                value={info}
                                onEditorChange={(value) => {
                                    setInfo(value);
                                    form.setFieldsValue({
                                        info: value,
                                    });
                                }}
                                onInit={(evt, editor) => (editorRef.current = editor)}
                                init={configEditorInit()}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Vibration"
                            name="vibration"
                            id="vibration"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Vibration !`,
                                },
                            ]}
                        >
                            <Editor
                                apiKey={process.env.REACT_APP_TINYMAC_KEY}
                                value={vibration}
                                onEditorChange={(value) => {
                                    setVibration(value);
                                    form.setFieldsValue({
                                        vibration: value,
                                    });
                                }}
                                onInit={(evt, editor) => (editorRef.current = editor)}
                                init={configEditorInit()}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Calibration"
                            name="calibration"
                            id="calibration"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Calibration !`,
                                },
                            ]}
                        >
                            <Editor
                                apiKey={process.env.REACT_APP_TINYMAC_KEY}
                                value={calibration}
                                onEditorChange={(value) => {
                                    setCalibration(value);
                                    form.setFieldsValue({
                                        calibration: value,
                                    });
                                }}
                                onInit={(evt, editor) => (editorRef.current = editor)}
                                init={configEditorInit()}
                            />
                        </Form.Item>
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
