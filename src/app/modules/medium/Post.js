import React, { Component } from "react";

import "./Post.scss";

import { Layout, Button, Icon, BackTop, Tag } from "antd";
import { withRouter } from "react-router-dom";
import Helmet from "react-helmet-async";
import Loading from "../loading/Loading";
import NotFound from "../not-found/NotFound";

const { Content } = Layout;

class Post extends Component {
    state = {
        loading: true,
        post   : {},
    };

    componentDidMount() {
        const { match } = this.props;
        const guid = match.params.id;

        // Scroll to top
        if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
        }

        FPTUSDK.crawl
            .getArticleDetails("medium", guid)
            .then(data => {
                this.setState({
                    loading: false,
                    post   : data,
                });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    post   : null,
                });
            });
    }

    goBack = () => {
        if (typeof window !== "undefined") {
            if (window.history.length === 1) {
                const { history } = this.props;
                history.push("/medium");
            } else {
                window.history.back();
            }
        }
    };

    render() {
        const { post, loading } = this.state;

        if (loading) {
            return <Loading />;
        }

        if (!post) {
            return <NotFound />;
        }

        return (
            <Content className="content-container">
                <Helmet>
                    <title>
                        {(post && post.title) ||
                            "Medium for Devs - FPTU Tech Insider"}
                    </title>
                </Helmet>
                <BackTop />
                <div className="content-wrapper">
                    <Button
                        type="primary"
                        size="large"
                        style={{ marginBottom: "1rem" }}
                        onClick={this.goBack}
                    >
                        <Icon type="caret-left" />
                        Quay lại danh sách bài
                    </Button>
                    <div className="post-body">
                        <h2 className="post-title">{post && post.title}</h2>
                        <div className="post-tags">
                            {post &&
                                post.categories.map(item => {
                                    return (
                                        <Tag
                                            color="geekblue"
                                            key={item}
                                            style={{ marginBottom: "0.5rem" }}
                                        >
                                            #
                                            {item}
                                        </Tag>
                                    );
                                })}
                        </div>
                        <div
                            className="post-content"
                            //eslint-disable-next-line
                            dangerouslySetInnerHTML={{
                                __html: post && post.content,
                            }}
                        />
                    </div>
                </div>
            </Content>
        );
    }
}

export default withRouter(Post);
