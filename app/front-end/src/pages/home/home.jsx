
// Layout.js
import React from 'react';
import Layout from '../../components/layout/layout';
import ListCourses from './list-courses';
import ListLesson from './list-lesson';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListUser from './list-user';


class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Layout >
            <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <div style={{ margin: '8px 64px 0px 64px', width: "90%", height: "auto" }}>
                    <ListUser />
                </div>


                <div style={{ margin: '8px 64px 0px 64px', width: "90%", alignItems: 'flex-start' }}>
                    <div style={{ margin: '4px 0px 4px 0px', width: "70%" }}>
                        <ListLesson />
                    </div>

                    <div style={{ margin: '4px 0px 4px 128px', width: "30%" }}>
                        <ListCourses />
                    </div>

                </div>
            </div>


            {/* <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ width: '90%', margin: '8px 32px 0px 128px' }}>
                    <ListLesson />
                </div>
                <div style={{ width: '10%', margin: '8px 128px 0px 4px' }}>
                    <ListUser />
                </div>

            </div> */}
        </Layout>
    }
}


export default Home;
