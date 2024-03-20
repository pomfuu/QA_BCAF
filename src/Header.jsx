/* eslint-disable no-unused-vars */
import "./main.css"

const Header = () => {
    return (
    <div className='container-fluid'>
        <div className="row align-items-center">
            <div className="col-3 text-center font2 mx-auto">
                <p style={{ fontSize: '3.6vw', marginBottom: '-0.7vw'}}>QA SCOREBOARD</p>
                <p style={{
                    backgroundColor: '#1E1E1E',
                    marginTop: '5px',
                    fontSize: '2vw',
                    color: '#FFFFFF',
                    borderRadius: '5px',}}>Steps Manager</p>
            </div>
        </div>
    </div>
    );
};

export default Header;