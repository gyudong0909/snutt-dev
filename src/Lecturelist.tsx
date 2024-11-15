import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Lecture {
  id: string;
  courseTitle: string;
  instructor: string;
  credit: number;
  department: string;
  academicYear: string;
  schedule: Schedule[];
}

interface Schedule {
  name: string;
  location: string;
  day: number; // 1: 월요일, 2: 화요일, ..., 5: 금요일
  startTime: number; // 시
  startMinute: number; // 분
  duration: number; // 분
  color: string;
  lectureId: string;
}

interface TimetableData {
  _id: string;
  lecture_list: Array<{
    _id: string;
    course_title: string;
    instructor: string;
    credit: number;
    department: string;
    academic_year: string;
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
  }>;
}

interface LocationState {
  timetableData?: TimetableData;
  timetableDataUpdated?: boolean;
}

interface LectureListProps {
  token: string;
}

const LectureList = ({ token }: LectureListProps) => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [timetableData, setTimetableData] = useState<TimetableData | null>(
    null,
  );
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  useEffect(() => {
    // 데이터 가져오기 함수 정의
    const fetchTimetable = async () => {
      try {
        if (
          locationState.timetableDataUpdated === true ||
          locationState.timetableData == null
        ) {
          const response = await fetch(
            `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/recent`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
              },
            },
          );

          if (!response.ok) {
            throw new Error('시간표 데이터를 가져오는 데 실패했습니다.');
          }

          const data = (await response.json()) as TimetableData;
          setTimetableData(data);
        } else {
          setTimetableData(locationState.timetableData);
        }
      } catch (error) {
        console.error(
          '시간표 데이터를 가져오는 도중 오류가 발생했습니다:',
          error,
        );
      }
    };

    // 초기 데이터 로드
    void fetchTimetable();

    // popstate 이벤트 리스너 등록
    const handlePopState = () => {
      void fetchTimetable();
    };

    window.addEventListener('popstate', handlePopState);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [
    token,
    location.key,
    locationState.timetableData,
    locationState.timetableDataUpdated,
  ]);

  useEffect(() => {
    if (timetableData == null) return;

    // 강의 목록을 상태로 설정
    const formattedLectures = timetableData.lecture_list.map((lecture) => {
      const schedule = lecture.class_time_json.map((classTime) => ({
        name: lecture.course_title,
        location: classTime.place,
        day: parseInt(classTime.day, 10),
        startTime: Math.floor(classTime.startMinute / 60),
        startMinute: classTime.startMinute % 60,
        duration: classTime.endMinute - classTime.startMinute,
        color: '#333', // 기본 색상 설정
        lectureId: lecture._id,
      }));

      return {
        id: lecture._id,
        courseTitle: lecture.course_title,
        instructor: lecture.instructor,
        credit: lecture.credit,
        department: lecture.department,
        academicYear: lecture.academic_year,
        schedule,
      };
    });

    setLectures(formattedLectures);
  }, [timetableData]);

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
      <h1 style={{ textAlign: 'center' }}>강의 목록 페이지</h1>
      <div>
        {lectures.length === 0 ? (
          <p>강의 목록이 없습니다.</p>
        ) : (
          lectures.map((lecture) => (
            <button
              key={lecture.id}
              style={{
                display: 'block',
                margin: '10px 0',
                padding: '20px',
                textAlign: 'left',
                width: '100%',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (timetableData != null && timetableData._id.length > 0) {
                  const selectedLecture = timetableData.lecture_list.find(
                    (lec) => lec._id === lecture.id,
                  );

                  if (selectedLecture != null) {
                    navigate(
                      `/timetables/${timetableData._id}/lectures/${lecture.id}`,
                      {
                        state: {
                          lectureData: selectedLecture,
                          token,
                          timetableData,
                        },
                      },
                    );
                  } else {
                    console.error('강의 데이터를 찾을 수 없습니다.');
                  }
                } else {
                  console.error('타임테이블 ID를 찾을 수 없습니다.');
                }
              }}
            >
              <strong>강의명:</strong> {lecture.courseTitle}
              <br />
              <strong>교수:</strong> {lecture.instructor}
              <br />
              <strong>학점:</strong> {lecture.credit}학점
              <br />
              <strong>과목:</strong> {lecture.department}
              <br />
              <strong>학년:</strong> {lecture.academicYear}
              <br />
              <strong>시간:</strong>{' '}
              {lecture.schedule.map((schedule, index) => (
                <span key={index}>
                  {`${['월', '화', '수', '목', '금'][schedule.day] ?? ''}, `}
                  {`${schedule.startTime}시 ${schedule.startMinute}분 ~ `}
                  {`${schedule.startTime + Math.floor((schedule.startMinute + schedule.duration) / 60)}시 ${(schedule.startMinute + schedule.duration) % 60}분`}
                  {index < lecture.schedule.length - 1 ? ', ' : ''}
                </span>
              ))}
              <br />
              <strong>장소:</strong>{' '}
              {lecture.schedule
                .map((schedule) => schedule.location)
                .filter(
                  (place, index, self) =>
                    place.length > 0 && self.indexOf(place) === index,
                )
                .join(', ')}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default LectureList;
