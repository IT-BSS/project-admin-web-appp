<template>
  <main class="auth-page">
    <div class="auth-form">
      <div class="auth-form__header">
        <h1 class="auth-form__title">Создать аккаунт</h1>
        <p class="auth-form__subtitle">Присоединяйтесь к нашему сообществу</p>
      </div>
      
      <form class="auth-form__form">
        <div class="input-row">
          <div class="input-group">
            <label class="input-group__label" for="firstName">Имя</label>
            <input 
              id="firstName"
              type="text" 
              class="input-group__input" 
              placeholder="Ваше имя"
              autocomplete="given-name"
            >
          </div>
          
          <div class="input-group">
            <label class="input-group__label" for="lastName">Фамилия</label>
            <input 
              id="lastName"
              type="text" 
              class="input-group__input" 
              placeholder="Ваша фамилия"
              autocomplete="family-name"
            >
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-group__label" for="email">Email</label>
          <input 
            id="email"
            type="email" 
            class="input-group__input" 
            placeholder="example@mail.com"
            autocomplete="email"
          >
        </div>
        
        <div class="input-group">
          <label class="input-group__label" for="username">Логин</label>
          <input 
            id="username"
            type="text" 
            class="input-group__input" 
            placeholder="Придумайте логин"
            autocomplete="username"
          >
        </div>
        
        <div class="input-group">
          <label class="input-group__label" for="newPassword">Пароль</label>
          <input 
            id="newPassword"
            type="password" 
            class="input-group__input" 
            placeholder="Придумайте надежный пароль"
            autocomplete="new-password"
          >
        </div>
        
        <div class="input-group">
          <label class="input-group__label" for="confirmPassword">Подтвердите пароль</label>
          <input 
            id="confirmPassword"
            type="password" 
            class="input-group__input" 
            placeholder="Повторите пароль"
            autocomplete="new-password"
          >
        </div>
        
        <div class="auth-form__agreement">
          <label class="checkbox">
            <input type="checkbox" class="checkbox__input">
            <span class="checkbox__checkmark"></span>
            <span class="checkbox__label">
              Я согласен с 
              <a href="#" class="agreement-link">условиями использования</a> 
              и 
              <a href="#" class="agreement-link">политикой конфиденциальности</a>
            </span>
          </label>
        </div>
        
        <button type="submit" class="btn btn--primary btn--full-width">
          Создать аккаунт
        </button>
      </form>
      
      <div class="auth-form__footer">
        <p class="auth-form__switch-text">
          Уже есть аккаунт? 
          <nuxt-link to="/login" class="auth-form__switch-link">Войти</nuxt-link>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// TODO: Link everything to the backend when it's ready
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #333333 0%, #2a2a2a 100%);
}

.auth-form {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;

  &__header {
    padding: 40px 32px 24px;
    text-align: center;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
  }

  &__subtitle {
    font-size: 16px;
    margin: 0;
    opacity: 0.9;
    font-weight: 400;
  }

  &__form {
    padding: 32px;
  }

  &__agreement {
    margin: 24px 0 32px;

    .checkbox__label {
      font-size: 13px;
      line-height: 1.5;
      color: #6b7280;
    }
  }

  &__footer {
    padding: 24px 32px 32px;
    text-align: center;
    border-top: 1px solid #f3f4f6;
  }

  &__switch-text {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
  }

  &__switch-link {
    color: #10b981;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: #059669;
    }
  }
}

.input-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;

  .input-group {
    flex: 1;
    margin-bottom: 0;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0;

    .input-group {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.input-group {
  margin-bottom: 24px;

  &__label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }

  &__input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 16px;
    transition: all 0.2s ease;
    background-color: #ffffff;
    color: #1f2937;
    box-sizing: border-box;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    &:hover {
      border-color: #d1d5db;
    }
  }
}

.checkbox {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  user-select: none;

  &__input {
    position: absolute;
    opacity: 0;
    cursor: pointer;

    &:checked + .checkbox__checkmark {
      background-color: #10b981;
      border-color: #10b981;

      &::after {
        opacity: 1;
        transform: rotate(45deg) scale(1);
      }
    }
  }

  &__checkmark {
    position: relative;
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    margin-right: 12px;
    margin-top: 2px;
    flex-shrink: 0;
    transition: all 0.2s ease;

    &::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 2px;
      width: 6px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      opacity: 0;
      transform: rotate(45deg) scale(0.8);
      transition: all 0.2s ease;
    }
  }

  &__label {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
    line-height: 1.4;
  }
}

.agreement-link {
  color: #10b981;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;

  &:hover {
    color: #059669;
    text-decoration: underline;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  box-sizing: border-box;

  &--primary {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &--full-width {
    width: 100%;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .auth-form {
    margin: 10px;
    max-width: none;
    
    &__header {
      padding: 32px 24px 20px;
    }

    &__title {
      font-size: 24px;
    }

    &__form {
      padding: 24px;
    }

    &__footer {
      padding: 20px 24px 24px;
    }
  }

  .input-group__input {
    padding: 12px 14px;
  }

  .btn {
    padding: 12px 20px;
  }
}
</style>