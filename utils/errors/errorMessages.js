const BadRequest = 'Некорректные данные.';
const Conflict = 'Конфликт данных.';
const ConflictEmail = 'E-mail уже используется.';
const Forbidden = 'Отказано в доступе.';
const InternalServer = 'Что-то пошло не так.';
const NotFound = 'Запрашиваемая информация не найдена.';
const Unauthorized = 'Необходима авторизация.';
const UnauthorizedLogin = 'Неправильные почта и/или пароль.';

const errorMessages = {
  BadRequest,
  Conflict,
  Forbidden,
  InternalServer,
  NotFound,
  Unauthorized,
  ConflictEmail,
  UnauthorizedLogin,
};

module.exports = errorMessages;
