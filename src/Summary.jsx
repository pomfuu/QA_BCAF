import "./main.css"
import Menu from "./Menu";
import SummaryPage from "./SummaryPage";


const Summary = () => {
    return (
        <div>
            <Menu />
            <div className="container-fluid px-5">
                <div className='container-fluid'>
                    <div className="row align-items-center">
                        <div className="col-3 text-center font2 mx-auto">
                            <p style={{ fontSize: '3.6vw', marginBottom: '-0.7vw' }}>QA DASHBOARD</p>
                            <p style={{
                                backgroundColor: '#1E1E1E',
                                marginTop: '5px',
                                fontSize: '2vw',
                                color: '#FFFFFF',
                                borderRadius: '5px',
                            }}>Summary</p>
                        </div>
                    </div>
                </div>
                <SummaryPage />
            </div>

        </div>
    );
};

export default Summary;