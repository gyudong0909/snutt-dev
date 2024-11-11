import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

interface LectureData {
  _id: string;
  academic_year: string;
  category: string;
  class_time_json: Array<{
    day: string;
    place: string;
    startMinute: number;
    endMinute: number;
    start_time: string;
    end_time: string;
    len: number;
    start: number;
    lectureBuildings: Array<{
      id: string;
      buildingNumber: string;
      buildingNameKor: string;
      buildingNameEng: string;
      locationInDMS: {
        latitude: number;
        longitude: number;
      };
      locationInDecimal: {
        latitude: number;
        longitude: number;
      };
      campus: string;
    }>;
  }>;
  classification: string;
  credit: number;
  department: string;
  instructor: string;
  lecture_number: string;
  quota: number;
  freshman_quota: number;
  remark: string;
  course_number: string;
  course_title: string;
  color: {
    bg: string;
    fg: string;
  };
  colorIndex: number;
  lecture_id: string;
  snuttEvLecture: {
    evLectureId: number;
  };
  class_time_mask: number[];
}

interface TimetableData {
  _id: string;
  user_id: string;
  year: number;
  semester: string;
  lecture_list: LectureData[];
  title: string;
  theme: string;
  themeId: string;
  isPrimary: boolean;
  updated_at: string;
}

interface LocationState {
  lectureData?: LectureData;
  timetableData?: TimetableData;
}

interface LectureProps {
  token: string;
}

const Lecture = ({ token }: LectureProps) => {
  useParams<{ lectureId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState;
  const lectureData = state.lectureData;
  const timetableData = state.timetableData;

  useEffect(() => {
    if (lectureData == null) {
      console.error('강의 데이터를 가져올 수 없습니다.');
      navigate(-1); // 이전 페이지로 이동
    }
  }, [lectureData, navigate]);

  const handleBackToMainPage = () => {
    navigate(-1);
  };

  const handleDeleteLecture = async () => {
    if (lectureData != null && timetableData != null) {
      const timetableId = timetableData._id;
      const timetableLectureId = lectureData.lecture_id;

      try {
        const response = await fetch(
          `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/${timetableId}/lecture/${timetableLectureId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
            },
          },
        );
        if (response.ok) {
          alert('강의가 삭제되었습니다.');
          navigate(-1);
        }
      } catch (error) {
        console.error('오류 발생:', error);
        alert('오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleBackToMainPage}
        style={{ position: 'absolute', top: '10px', left: '10px' }}
      >
        뒤로가기
      </button>
      <h1 style={{ textAlign: 'center' }}>강의 상세보기</h1>
      {lectureData != null ? (
        <>
          <p>강의명: {lectureData.course_title}</p>
          <p>교수님: {lectureData.instructor}</p>
          <p>학과: {lectureData.department}</p>
          <p>학점: {lectureData.credit}</p>
          <p>학년: {lectureData.academic_year}</p>
          <p>분류: {lectureData.category}</p>
          <p>강좌번호: {lectureData.course_number}</p>
          <p>분반번호: {lectureData.lecture_number}</p>
          <p>정원: {lectureData.quota}</p>
          <p>
            수업 시간 및 장소:
            {lectureData.class_time_json.map((schedule, index) => (
              <span key={index}>
                {`${['월', '화', '수', '목', '금'][parseInt(schedule.day)] ?? ''}, `}
                {`${Math.floor(schedule.startMinute / 60)}시 ${schedule.startMinute % 60}분 ~ `}
                {`${Math.floor(schedule.endMinute / 60)}시 ${schedule.endMinute % 60}분`}
                {schedule.place.length > 0 ? ` (${schedule.place})` : ''}
                {index < lectureData.class_time_json.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
          <button
            onClick={() => {
              handleDeleteLecture().catch((error: unknown) => {
                console.error('삭제 중 오류 발생:', error);
              });
            }}
            style={{ width: '100px', height: '50px', cursor: 'pointer' }}
          >
            삭제
          </button>
        </>
      ) : (
        <p>강의 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
};

export default Lecture;
