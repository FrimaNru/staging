import styles from "@/styles/Common.module.css";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";

export default function DocumentsModal({ policy, setPolicy, personal, setPersonal, news, setNews }) {
    return <>
        {policy && <Modal isOpen={policy} onClose={() => setPolicy(false)}>
            <ModalOverlay />
            <ModalContent>

            </ModalContent>
        </Modal>}
    </>
};