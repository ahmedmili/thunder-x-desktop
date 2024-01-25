import { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import newsLetterImg from './../../assets/newsletter-icn.png';
import style from './footerNewsLetter.module.scss';
interface FormValues {
    email: string;
}


export const FooterNewsLeter = () => {

    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        email: Yup.string().
            required(`${t('auth.email.required')}`)
            .email(`${t('auth.email.type')}`)
            .label("Email"),
    });
    const [formData, setFormData] = useState<FormValues>({ email: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouchedFields({
            ...touchedFields,
            [e.target.name]: true,
        });
    };

    const shouldDisplayError = (fieldName: string) => {
        return touchedFields[fieldName] && !!errors[fieldName];
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        validationSchema
            .validate(formData, { abortEarly: false })
            .then(() => {
                // Handle the submission logic here
                setErrors({ email: '' });

            })
            .catch((validationErrors) => {
                const newErrors: { [key: string]: string } = {};
                validationErrors.inner.forEach((error: Yup.ValidationError) => {
                    newErrors[error.path as string] = error.message;
                });
                setErrors(newErrors);
            });
    };

    return (
        <div className={style.newsLetterArea}>
            <Container className={style.newsLetterContainer}>
                <form onSubmit={handleSubmit}>
                    <div className={style.newsLetterDescription}>
                        <h3 className={style.newsLetterTitle}>{t('newsLetter.abonnez')}</h3>
                        <p className={style.newsLetterDesc}>
                            {t('newsLetter.beUpToDate')}
                        </p>
                        <div className={style.emailWrapper}>
                            <Form.Control
                                className={style.formControl}
                                name="email"
                                type="text"
                                placeholder="Votre adresse e-mail"
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                                onBlur={handleBlur}
                            />
                            <button
                                className={style.btnEmailSubmit}
                            >
                                {t('newsLetter.sAbonner')}
                                <span className={style.icon}>
                                </span>
                            </button>

                            <p className={style.newsLetterErrorsMessage}>
                                {shouldDisplayError("email") && errors.email}
                            </p>                        </div>
                    </div>
                </form>
                <div className={style.newsLetterImg}>
                    <img src={newsLetterImg} alt="News Letter Img" />
                </div>

            </Container>
        </div>
    )

}
