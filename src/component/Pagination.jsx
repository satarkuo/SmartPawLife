import PropTypes from 'prop-types'; 
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


function Pagination ({pageInfo, handlePageChange}) {
    const navigate = useNavigate();
    const location = useLocation();    
    const { current_page } = pageInfo
    useEffect(() => {
        navigate(`${location.pathname}?page=${current_page}`)
    }, [current_page, location.pathname, navigate])
    return (
        <nav className="my-3">
            <ul className="pagination justify-content-center gap-3">
                <li className={`page=item ${!pageInfo?.has_pre && 'disabled'}`}>
                    <Link className="page-link border-0 rounded-5 px-3" 
                        onClick={() => handlePageChange(pageInfo?.current_page-1)}>上一頁</Link>
                </li>
            
                {Array.from({length: pageInfo?.total_pages}).map((_,index) => (
                    <li className={`page-item ${index+1 === pageInfo?.current_page && 'active' } `} key={index}>
                        <Link className="page-link border-0 rounded-5 px-3" 
                            onClick={() => handlePageChange(index+1)}>{index+1}</Link>
                    </li>
                ))}
                <li className={`page=item ${!pageInfo?.has_next && 'disabled'}`}>
                    <Link className="page-link border-0 rounded-5 px-3" 
                        onClick={() => handlePageChange(pageInfo?.current_page+1)}>下一頁</Link>
                </li>
            </ul>
        </nav>
    )
}
export default Pagination;
Pagination.propTypes = {
    pageInfo: PropTypes.object.isRequired,
    handlePageChange: PropTypes.func.isRequired
}