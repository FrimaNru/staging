import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react'
import { useState } from 'react'
import { SignIn, SignUp, RefreshPassword } from '@/components';

export function AuthModal({ isOpen, onClose }) {

    const [stateAuth, setStateAuth] = useState('signIn');

    function selectAuth() {
        switch (stateAuth) {
            case 'signIn':
                return <SignIn setStateAuth={setStateAuth} onClose={onClose} />
            case 'signUp':
                return <SignUp setStateAuth={setStateAuth} onClose={onClose} />
            case 'refresh':
                return <RefreshPassword setStateAuth={setStateAuth} onClose={onClose} />
        }
    };

    return <>
        <Modal isOpen={isOpen} size='xl' onClose={onClose} autoFocus={false} isCentered >
            <ModalOverlay />
            <ModalContent p={0} bg='none' boxShadow='none'>
                <ModalBody p={0}>
                    {selectAuth()}
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}