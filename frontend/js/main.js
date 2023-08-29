// Этап 1. В HTML файле создайте верстку элементов, которые будут статичны(неизменны).

// Этап 2. Создайте массив объектов студентов.Добавьте в него объекты студентов, например 5 студентов.

let studentsList = []

let sortColumnFlag = 'fio'
sortDirFlag = true;

const $app = document.getElementById('app'),
  $addForm = document.getElementById('add-form'),
  $nameInput = document.getElementById('name')
$surnameInput = document.getElementById('surname')
$mnameInput = document.getElementById('mname')
$bDayInput = document.getElementById('bday')
$startInput = document.getElementById('start')
$facultyInput = document.getElementById('faculty')
$table = document.createElement('table'),
  $tableHead = document.createElement('thead'),
  $tableBody = document.createElement('tbody'),
  $tableHeadTr = document.createElement('tr'),
  $tableHeadThFIO = document.createElement('th'),
  $tableHeadThBirthDate = document.createElement('th'),
  $tableHeadThStartDate = document.createElement('th'),
  $tableHeadThFaculty = document.createElement('th'),
  $tableHeadThDelete = document.createElement('th'),
  $filterForm = document.getElementById('filter-form'),
  $filterFIO = document.getElementById('filter-form__fio-inp'),
  $filterBDay = document.getElementById('filter-form__bday-inp'),
  $filterStart = document.getElementById('filter-form__start-inp'),
  $filterFaculty = document.getElementById('filter-form__faculty-inp'),


  $table.classList.add('table', 'table-hover')

$tableHeadThFIO.classList.add('fio'),
  $tableHeadThBirthDate.classList.add('birth-date'),
  $tableHeadThStartDate.classList.add('start-date'),
  $tableHeadThFaculty.classList.add('faculty'),

  $app.append($table)
$table.append($tableHead)
$table.append($tableBody)
$tableHead.append($tableHeadTr)
$tableHeadTr.append($tableHeadThFIO)
$tableHeadTr.append($tableHeadThBirthDate)
$tableHeadTr.append($tableHeadThStartDate)
$tableHeadTr.append($tableHeadThFaculty)
$tableHeadTr.append($tableHeadThDelete)

$tableHeadThFIO.textContent = 'Имя'
$tableHeadThBirthDate.textContent = 'Дата рождения'
$tableHeadThStartDate.textContent = 'Дата начала обучения'
$tableHeadThFaculty.textContent = 'Факультет'

// Этап 3. Создайте функцию вывода одного студента в таблицу, по аналогии с тем, как вы делали вывод одного дела в модуле 8. Функция должна вернуть html элемент с информацией и пользователе.У функции должен быть один аргумент - объект студента.

function createUserTr(user) {
  const $userTr = document.createElement('tr'),
    $userThFIO = document.createElement('th'),
    $userThBirthDate = document.createElement('th'),
    $userThStartDate = document.createElement('th'),
    $userThFaculty = document.createElement('th');
  $userThDelete = document.createElement('th')
  $userDeleteButton = document.createElement('button')
  $userDeleteButton.textContent = 'Удалить'
  $userDeleteButton.classList.add('btn', 'btn-danger')
  $userThDelete.append($userDeleteButton)
  $userDeleteButton.addEventListener('click', async function () {
    const response = await fetch(`http://localhost:3010/api/students/${user.id}`, {
      method: 'DELETE',
    });

    $userTr.remove()
    studentsList = studentsList.filter(({ id }) => {
      return user.id !== id
    })
  })

  $userTr.append($userThFIO)
  $userTr.append($userThBirthDate)
  $userTr.append($userThStartDate)
  $userTr.append($userThFaculty)
  $userTr.append($userThDelete)


  $userThFIO.textContent = user.fio
  $userThBirthDate.textContent = user.shortDate
  $userThStartDate.textContent = user.study
  $userThFaculty.textContent = user.faculty

  return $userTr
}

// Этап 4. Создайте функцию отрисовки всех студентов. Аргументом функции будет массив студентов.Функция должна использовать ранее созданную функцию создания одной записи для студента.Цикл поможет вам создать список студентов.Каждый раз при изменении списка студента вы будете вызывать эту функцию для отрисовки таблицы.
function isEqual(obj, prop, value) {
  return String(obj[prop]).toLowerCase().includes(value.trim())
}

function renderStudentsTable(studentsArray) {
  $tableBody.innerHTML = '';

  let copyStudentsList = [...studentsArray].filter((student) => {
    const isFioValid = $filterFIO.value.trim() !== '' && !isEqual(student, 'fio', $filterFIO.value)
    const isBirthDayValid = $filterBDay.value.trim() !== '' && !isEqual(student, 'birthday', $filterBDay.value)
    const isStartDateValid = $filterStart.value.trim() !== '' && !isEqual(student, 'startDate', $filterStart.value)
    const isFacultyValid = $filterFaculty.value.trim() !== '' && !isEqual(student, 'faculty', $filterFaculty.value)
    if (isFioValid || isBirthDayValid || isStartDateValid || isFacultyValid) {
      return false
    }
    return true
  });

  // сортировка
  copyStudentsList.sort(function (a, b) {
    let sort = a[sortColumnFlag] < b[sortColumnFlag];
    if (sortDirFlag == false) {
      sort = a[sortColumnFlag] > b[sortColumnFlag]
    }
    if (sort) {
      return -1
    }
  })

  // подготовка
  for (const user of copyStudentsList) {

    user.fio = user.surname + ' ' + user.name + ' ' + user.lastname

    user.birthday = new Date(user.birthday)
    let monthOfBirth = ('0' + (user.birthday.getMonth() + 1)).slice(-2);
    dateOfBirth = ('0' + user.birthday.getDate()).slice(-2);
    yearOfBirth = user.birthday.getFullYear();
    currentDate = new Date
    currentAge = (currentDate.getFullYear() - yearOfBirth).toString()
    if (currentAge.endsWith('1')) {
      user.shortDate = dateOfBirth + '.' + monthOfBirth + '.' + yearOfBirth + ' (' + currentAge + ' год)';
    } else if (currentAge.endsWith('2') || currentAge.endsWith('3') || currentAge.endsWith('4')) {
      user.shortDate = dateOfBirth + '.' + monthOfBirth + '.' + yearOfBirth + ' (' + currentAge + ' года)';
    } else {
      user.shortDate = dateOfBirth + '.' + monthOfBirth + '.' + yearOfBirth + ' (' + currentAge + ' лет)';
    }

    user.studyStart = new Date(user.studyStart);
    let yearOfStart = user.studyStart.getFullYear();
    endDate = yearOfStart + 4
    const period = yearOfStart + ' - ' + endDate
    const yearDiff = currentDate.getFullYear() - yearOfStart
    if (endDate < currentDate.getFullYear()) {
      user.study = period + (' (закончил)')
    } else if (yearDiff <= 4) {
      user.study = period + (` ${yearDiff} курс`)
    } else {
      user.study = period
    }

    $tableBody.append(createUserTr(user))
  }
}


renderStudentsTable(studentsList)

$addForm.addEventListener('submit', async e => {
  e.preventDefault()
  const formData = new FormData(e.target);

  const objStudent = {
    name: formData.get('name'),
    surname: formData.get('surname'),
    lastname: formData.get('mname'),
    birthday: formData.get('bday'),
    studyStart: formData.get('start'),
    faculty: formData.get('faculty'),
  }
  // POST /api/students - создать студента, в теле запроса нужно передать объект { name: string, surname: string, lastname: string, birthday: string, studyStart: string, faculty: string}
  const response = await fetch('http://localhost:3010/api/students', {
    method: 'POST',
    body: JSON.stringify(objStudent),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const student = await response.json();

  studentsList.push(student)

  $addForm.innerHTML = ''

  renderStudentsTable(studentsList)

})

// Этап 5. К форме добавления студента добавьте слушатель события отправки формы, в котором будет проверка введенных данных.Если проверка пройдет успешно, добавляйте объект с данными студентов в массив студентов и запустите функцию отрисовки таблицы студентов, созданную на этапе 4.


// Этап 5. Создайте функцию сортировки массива студентов и добавьте события кликов на соответствующие колонки.

$tableHeadThFIO.addEventListener('click', function () {
  sortColumnFlag = 'fio'
  sortDirFlag = !sortDirFlag
  $tableHeadThBirthDate.classList.remove('arrow')
  $tableHeadThStartDate.classList.remove('arrow')
  $tableHeadThFaculty.classList.remove('arrow')
  $tableHeadThFIO.classList.add('arrow')
  renderStudentsTable(studentsList)
})

$tableHeadThBirthDate.addEventListener('click', function () {
  sortColumnFlag = 'birthday'
  sortDirFlag = !sortDirFlag
  $tableHeadThFIO.classList.remove('arrow')
  $tableHeadThStartDate.classList.remove('arrow')
  $tableHeadThFaculty.classList.remove('arrow')
  $tableHeadThBirthDate.classList.add('arrow')
  renderStudentsTable(studentsList)
})

$tableHeadThStartDate.addEventListener('click', function () {
  sortColumnFlag = 'startDate'
  sortDirFlag = !sortDirFlag
  $tableHeadThFIO.classList.remove('arrow')
  $tableHeadThBirthDate.classList.remove('arrow')
  $tableHeadThFaculty.classList.remove('arrow')
  $tableHeadThStartDate.classList.add('arrow')
  renderStudentsTable(studentsList)
})

$tableHeadThFaculty.addEventListener('click', function () {
  sortColumnFlag = 'faculty'
  sortDirFlag = !sortDirFlag
  $tableHeadThFIO.classList.remove('arrow')
  $tableHeadThBirthDate.classList.remove('arrow')
  $tableHeadThStartDate.classList.remove('arrow')
  $tableHeadThFaculty.classList.add('arrow')
  renderStudentsTable(studentsList)
})


// Этап 6. Создайте функцию фильтрации массива студентов и добавьте события для элементов формы.

$filterForm.addEventListener('submit', function (e) {
  e.preventDefault()
})


$filterFIO.addEventListener('input', function () {
  renderStudentsTable(studentsList)
})

$filterBDay.addEventListener('input', function () {
  renderStudentsTable(studentsList)
})

$filterStart.addEventListener('input', function () {
  renderStudentsTable(studentsList)
})

$filterFaculty.addEventListener('input', function () {
  renderStudentsTable(studentsList)
})

function filter(arr, prop, value) {
  return arr.filter(function (user) {
    if (String(user[prop]).toLowerCase().includes(value.trim())) {
      return true
    }
  })
}

window.addEventListener('load', e => {
  fetch('http://localhost:3010/api/students', {

  }).then((response) => {
    return response.json()
  }).then((students) => {
    studentsList = students
    renderStudentsTable(studentsList)
  })
})

