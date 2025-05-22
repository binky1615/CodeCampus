import "../styles/CourseCard.css";
import { useState } from "react";

const CourseCard = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!course) {
    return (
      <article className="course-card empty">
        Geen cursus informatie beschikbaar
      </article>
    );
  }

  return (
    <>
      <article className="course-card">
        <figure className="course-image">
          <img src={course.imageUrl} alt={course.title} />
        </figure>
        <div className="course-content">
          <h3>{course.title}</h3>
          <p className="course-description">{course.description}</p>
          <dl className="course-details">
            <div>
              <dt className="visually-hidden">Niveau</dt>
              <dd className="level">Niveau: {course.level}</dd>
            </div>
            <div>
              <dt className="visually-hidden">Duur</dt>
              <dd className="duration">Duur: {course.duration}</dd>
            </div>
          </dl>
          <footer className="course-stats">
            <span className="members">{course.members} leden</span>
            <span className="views">{course.views} weergaven</span>
            <span className="rating">⭐ {course.rating}</span>
          </footer>
          <div className="course-actions">
            <button className="course-button" onClick={openModal}>
              Meer informatie
            </button>
          </div>
        </div>
      </article>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal">
            <h2>{course.title}</h2>            
            <div className="modal-details">
              <img src={course.imageUrl} alt={course.title} className="modal-image" />
              <p>{course.description}</p>
              <dl className="modal-info">
                <dd>Niveau: {course.level}</dd>
                <dd>Duur: {course.duration}</dd>
              </dl>
              <div className="modal-stats">
                <span>{course.members} leden</span>
                <span>{course.views} weergaven</span>
                <span>⭐ {course.rating}</span>
              </div>
              <div className="modal-categories">
                <p>Categories:</p>
                {
                  course.categories.map((item) => (
                    <span >{item}</span>
                  ))
                }
              </div>
              <div className="modal-buttons">
                <a href={course.videoUrl} target="_blank" rel="noopener noreferrer" className="course-button">
                  <button className="course-button-a">Bekijk Video</button>
                </a>
                <button onClick={closeModal} className="closing-button">
                X
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseCard;
