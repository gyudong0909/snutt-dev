import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import styles from './Lecture.module.css';

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
    <div className={styles.container}>
      {/* Upper Bar */}
      <div className={styles.upperBar}>
        <button
          onClick={handleBackToMainPage}
          className={styles.sideSection}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          뒤로가기
        </button>
        <div className={styles.topSection}>강의 상세보기</div>
        <div className={styles.sideSection}></div>
      </div>

      {lectureData != null ? (
        <div className={styles.content}>
          {/* Lecture Information */}
          <div className={styles.subtitle}>강의 정보</div>

          {/* Course Title */}
          <div className={styles.text}>
            <div className={styles.textLeft}>강의명</div>
            <div className={styles.textRight}>{lectureData.course_title}</div>
          </div>

          {/* Instructor */}
          <div className={styles.text}>
            <div className={styles.textLeft}>교수님</div>
            <div className={styles.textRight}>{lectureData.instructor}</div>
          </div>

          {/* Department */}
          <div className={styles.text}>
            <div className={styles.textLeft}>학과</div>
            <div className={styles.textRight}>{lectureData.department}</div>
          </div>

          {/* Credit */}
          <div className={styles.text}>
            <div className={styles.textLeft}>학점</div>
            <div className={styles.textRight}>{lectureData.credit}</div>
          </div>

          {/* Academic Year */}
          <div className={styles.text}>
            <div className={styles.textLeft}>학년</div>
            <div className={styles.textRight}>{lectureData.academic_year}</div>
          </div>

          {/* Category */}
          <div className={styles.text}>
            <div className={styles.textLeft}>분류</div>
            <div className={styles.textRight}>{lectureData.category}</div>
          </div>

          {/* Course Number */}
          <div className={styles.text}>
            <div className={styles.textLeft}>강좌번호</div>
            <div className={styles.textRight}>{lectureData.course_number}</div>
          </div>

          {/* Lecture Number */}
          <div className={styles.text}>
            <div className={styles.textLeft}>분반번호</div>
            <div className={styles.textRight}>{lectureData.lecture_number}</div>
          </div>

          {/* Quota */}
          <div className={styles.text}>
            <div className={styles.textLeft}>정원</div>
            <div className={styles.textRight}>{lectureData.quota}</div>
          </div>

          {/* Class Time and Place */}
          <div className={styles.subtitle}>시간 및 장소</div>
          {lectureData.class_time_json.map((schedule, index) => (
            <>
              <div className={styles.text} key={index}>
                <div className={styles.textLeft}>시간</div>
                <div className={styles.textRight}>
                  {!isNaN(parseInt(schedule.day)) &&
                  parseInt(schedule.day) >= 0 &&
                  parseInt(schedule.day) < 5
                    ? ['월', '화', '수', '목', '금'][parseInt(schedule.day)]
                    : ''}
                  {` ${Math.floor(schedule.startMinute / 60)}시 ${schedule.startMinute % 60}분 ~ `}
                  {`${Math.floor(schedule.endMinute / 60)}시 ${schedule.endMinute % 60}분`}
                </div>
              </div>
              <div className={styles.text} key={index}>
                <div className={styles.textLeft}>장소</div>
                <div className={styles.textRight}>
                  {schedule.place.length > 0 ? ` ${schedule.place}` : ''}
                </div>
              </div>
            </>
          ))}
          <div className={styles.subtitle}></div>
          <button
            className={styles.button}
            onClick={() => {
              handleDeleteLecture().catch((error: unknown) => {
                console.error('삭제 중 오류 발생:', error);
              });
            }}
            style={{}}
          >
            삭제
          </button>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.text}>
            <div className={styles.textLeft}>
              강의 정보를 불러올 수 없습니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lecture;
