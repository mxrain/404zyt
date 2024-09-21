import styles from './ResourceCardList.module.css';
import ResourceCard from './ResourceCard/ResourceCard';

const ResourceCardList = ({ resources }) => {
    const resourceArray = Array.isArray(resources) 
        ? resources 
        : Object.entries(resources).map(([id, resource]) => ({
            ...resource,
            id: resource.uuid || id
          }));

    if (resourceArray.length === 0) {
        return <div className={styles.empty}>暂无资源</div>;
    }

    return (
        <div className={styles.gridContainer}>
            {resourceArray.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
            ))}
        </div>
    );
};

export default ResourceCardList;