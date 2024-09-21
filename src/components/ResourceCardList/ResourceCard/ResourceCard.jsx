import styles from './ResourceCard.module.css';
import { Link } from 'react-router-dom';

const ResourceCard = ({ resource }) => {
    if (!resource.uuid) {
        return (
            <div className={`${styles.card} ${styles.emptyCard}`}>
                <p>资源不存在</p>
            </div>
        );
    }

    return (
        <Link to={`/resource/${resource.id}`} className={styles.cardLink}>
            <div className={styles.card}>
                <h2 className={styles.title}>{resource.title}</h2>
                <p className={styles.category}>{resource.category}</p>
            </div>
        </Link>
    );
};

export default ResourceCard;
