import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Lecture {
  id: string;
  courseTitle: string;
}

interface TimetableData {
  _id: string;
  lecture_list: Array<{
    _id: string;
    course_title: string;
  }>;
}

interface LocationState {
  timetableData?: TimetableData;
}

const LectureList = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Location의 상태를 타입 지정
  const locationState = location.state as LocationState;

  useEffect(() => {
    const timetableData = locationState.timetableData;
    if (timetableData == null) {
      console.error('타임테이블 데이터를 가져오는 데 실패했습니다.');
      return;
    }

    // 강의 목록을 상태로 설정
    setLectures(
      timetableData.lecture_list.map((lecture) => ({
        id: lecture._id,
        courseTitle: lecture.course_title,
      })),
    );
  }, [locationState, navigate]);

  const handleBackToMainPage = () => {
    navigate(-1);
  };

  return (
    <div>
      <button
        onClick={handleBackToMainPage}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '100px',
          height: '50px',
        }}
      >
        뒤로가기
      </button>
      <h1>...........강의 목록 페이지</h1>
      <div>
        {lectures.length === 0 ? (
          <p>강의 목록이 없습니다.</p>
        ) : (
          lectures.map((lecture) => (
            <button
              key={lecture.id}
              style={{ display: 'block', margin: '10px 0' }}
              onClick={() => {
                if (
                  locationState.timetableData != null &&
                  locationState.timetableData._id.length > 0
                ) {
                  navigate(
                    `/timetables/${locationState.timetableData._id}/lectures/${lecture.id}`,
                  );
                } else {
                  console.error('타임테이블 ID를 찾을 수 없습니다.');
                }
              }}
            >
              {lecture.courseTitle}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default LectureList;
